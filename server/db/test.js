const { Person, Post, PostLike } = require("./index")

main()

async function main() {
    // delete all
    await PostLike.query().delete()
    await Post.query().delete()
    await Person.query().delete()

    zbyszek = await Person.query().insertAndFetch({ name: "Zbyszek" })
    console.log("zbyszek", zbyszek)

    post = await Post.query().insertAndFetch({
        content: "Lorem ipsum",
        author_id: zbyszek.id,
    })
    console.log("post", post)

    like = await PostLike.query().insertAndFetch({
        person_id: zbyszek.id,
        post_id: post.id,
    })
    console.log("like", like)

    zbyszek = await Person.query()
        .eager("[posts, liked_posts, likes.[post, person]]")
        .first()
    console.log("uber zbyszek", zbyszek)

    post = await Post.query()
        .eager("[author, liked_by, likes.[post, person]]")
        .first()
    console.log("uber post", post)

    process.exit(0)
}
