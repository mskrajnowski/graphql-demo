exports.up = function(knex, Promise) {
    return knex.schema.createTable("posts", t => {
        t.increments()
        t.integer("author_id")
            .unsigned()
            .notNull()
        t.string("content").notNull()
        t.date("created_at").notNull()
        t.date("updated_at").notNull()

        t.foreign("author_id")
            .references("id")
            .inTable("people")
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("posts")
}
