exports.up = function(knex, Promise) {
    return knex.schema.createTable("people", t => {
        t.increments()
        t.string("name").notNull()
        t.date("created_at").notNull()
        t.date("updated_at").notNull()
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("people")
}
