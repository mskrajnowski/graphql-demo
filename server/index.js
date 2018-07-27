const { ApolloServer, gql } = require("apollo-server")
const fs = require("fs")
const path = require("path")
const Dataloader = require("dataloader")
const { keyBy, groupBy } = require("lodash")

const { Person, Post, PostLike } = require("./db")

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = fs.readFileSync(
    path.join(__dirname, "..", "schema", "schema.graphql"),
    "utf8"
)

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
        person: async (_, { id }, { loaders }) => loaders.person.byId.load(id),
        people: async (_, { page = 1 }, { loaders }) => {
            const people = (await Person.query().page(page - 1, 10)).results
            people.forEach(person =>
                loaders.person.byId.prime(person.id, person)
            )
            return people
        },

        post: async (_, { id }, { loaders }) => loaders.post.byId.load(id),
        posts: async (_, { page = 1 }, { loaders }) => {
            const posts = (await Post.query().page(page - 1, 10)).results
            posts.forEach(post => loaders.post.byId.prime(post.id, post))
            return posts
        },
    },
    Person: {
        createdAt: person => new Date(person.createdAt).toISOString(),
        updatedAt: person => new Date(person.updatedAt).toISOString(),

        posts: async (person, _, { loaders }) =>
            loaders.post.byAuthorId.load(person.id),
        likes: async (person, _, { loaders }) =>
            loaders.like.byPersonId.load(person.id),
        likedPosts: async (person, _, { loaders }) => {
            const likes = await loaders.like.byPersonId.load(person.id)
            return Promise.all(
                likes.map(like => loaders.post.byId.load(like.postId))
            )
        },
    },
    Post: {
        createdAt: post => new Date(post.createdAt).toISOString(),
        updatedAt: post => new Date(post.updatedAt).toISOString(),

        author: async (post, _, { loaders }) =>
            loaders.person.byId.load(post.authorId),
        likes: async (post, _, { loaders }) =>
            loaders.like.byPostId.load(post.id),
        likedBy: async (post, _, { loaders }) => {
            const likes = await loaders.like.byPostId.load(post.id)
            return Promise.all(
                likes.map(like => loaders.person.byId.load(like.personId))
            )
        },
    },
    Like: {
        createdAt: like => new Date(like.createdAt).toISOString(),

        person: async (like, _, { loaders }) =>
            loaders.person.byId.load(like.personId),
        post: async (like, _, { loaders }) =>
            loaders.post.byId.load(like.postId),
    },
}

async function context() {
    const loaders = {
        person: {
            byId: new Dataloader(async ids => {
                const people = await Person.query().findByIds(ids)
                const peopleById = keyBy(people, "id")
                return ids.map(id => peopleById[id])
            }),
        },
        post: {
            byId: new Dataloader(async ids => {
                const posts = await Post.query().findByIds(ids)
                const postsById = keyBy(posts, "id")
                return ids.map(id => postsById[id])
            }),
            byAuthorId: new Dataloader(async ids => {
                const posts = await Post.query().whereIn("authorId", ids)
                const postsByAuthorId = groupBy(posts, "authorId")
                return ids.map(id => postsByAuthorId[id] || [])
            }),
        },
        like: {
            byPersonId: new Dataloader(async ids => {
                const likes = await PostLike.query().whereIn("personId", ids)
                const likesByPersonId = groupBy(likes, "personId")
                return ids.map(id => likesByPersonId[id] || [])
            }),
            byPostId: new Dataloader(async ids => {
                const likes = await PostLike.query().whereIn("postId", ids)
                const likesByPostId = groupBy(likes, "postId")
                return ids.map(id => likesByPostId[id] || [])
            }),
        },
    }

    return { loaders }
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
})
