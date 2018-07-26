const { Person, Post } = require("./index")

main()

async function main() {
    // delete all
    await Person.query().delete()
    await Post.query().delete()

    zbyszek = await Person.query().insertAndFetch({ name: "Zbyszek" })
    console.log("zbyszek", zbyszek)

    post = await Post.query().insertAndFetch({
        content: "Lorem ipsum",
        author_id: zbyszek.id,
    })
    console.log("post", post)

    zbyszek = await Person.query()
        .eager("posts")
        .first()
    console.log("zbyszek with posts", zbyszek)

    post = await Post.query()
        .eager("author")
        .first()
    console.log("post with author", post)

    await Person.query().delete()

    post = await Post.query()
        .eager("author")
        .first()
    console.log("post without author", post)

    process.exit(0)
}
