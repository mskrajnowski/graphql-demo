exports.up = function(knex, Promise) {
    return knex.schema.createTable("post_likes", t => {
        t.increments()
        t.integer("person_id")
            .unsigned()
            .notNull()
        t.integer("post_id")
            .unsigned()
            .notNull()
        t.date("created_at").notNull()

        t.foreign("person_id")
            .references("id")
            .inTable("people")
        t.foreign("post_id")
            .references("id")
            .inTable("posts")

        t.index("person_id")
        t.index("post_id")
        t.unique(["person_id", "post_id"])
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("post_likes")
}
