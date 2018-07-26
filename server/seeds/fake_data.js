const faker = require("faker")

exports.seed = async function(knex, Promise) {
    await knex("post_likes").del()
    await knex("posts").del()
    await knex("people").del()

    const people = []
    for (let i = 1; i <= 100; ++i) {
        people.push({
            id: i,
            name: faker.name.findName(),
            created_at: faker.date.recent(),
            updated_at: faker.date.recent(),
        })
    }
    await knex("people").insert(people)

    const posts = []
    for (let i = 1; i <= 100; ++i) {
        posts.push({
            id: i,
            author_id: Math.ceil(Math.random() * 99) + 1,
            content: faker.lorem.sentence(),
            created_at: faker.date.recent(),
            updated_at: faker.date.recent(),
        })
    }
    await knex("posts").insert(posts)

    const likePairs = new Set()
    for (let batch = 0; batch < 10; ++batch) {
        const likes = []
        for (let i = 1; i <= 100; ++i) {
            let person_id, post_id

            while (true) {
                person_id = Math.ceil(Math.random() * 99) + 1
                post_id = Math.ceil(Math.random() * 99) + 1

                const key = `${person_id}_${post_id}`
                if (!likePairs.has(key)) {
                    likePairs.add(key)
                    break
                }
            }

            likes.push({
                id: i + batch * 100,
                person_id,
                post_id,
                created_at: faker.date.recent(),
            })
        }
        await knex("post_likes").insert(likes)
    }
}
