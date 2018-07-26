const { ApolloServer, gql } = require("apollo-server")
const fs = require("fs")
const path = require("path")

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
        person: (_, { id }) => Person.query().findById(id),
        people: () =>
            Person.query()
                .limit(10)
                .select(),
        post: (_, { id }) => Post.query().findById(id),
        posts: () =>
            Post.query()
                .limit(10)
                .select(),
    },
    Person: {
        createdAt: async person => new Date(person.createdAt).toISOString(),
        updatedAt: async person => new Date(person.updatedAt).toISOString(),
        posts: async person => person.$relatedQuery("posts"),
        likes: async person => person.$relatedQuery("likes"),
        likedPosts: async person => person.$relatedQuery("likedPosts"),
    },
    Post: {
        createdAt: async person => new Date(person.createdAt).toISOString(),
        updatedAt: async person => new Date(person.updatedAt).toISOString(),
        author: async post => post.$relatedQuery("author"),
        likes: async post => post.$relatedQuery("likes"),
        likedBy: async post => post.$relatedQuery("likedBy"),
    },
    Like: {
        createdAt: async person => new Date(person.createdAt).toISOString(),
        person: async like => like.$relatedQuery("person").first(),
        post: async like => like.$relatedQuery("post").first(),
    },
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
})
