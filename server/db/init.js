const { Model, knexSnakeCaseMappers } = require("objection")
const Knex = require("knex")

// Initialize knex.
const knex = Knex({
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
        filename: "dev.sqlite3",
    },
    ...knexSnakeCaseMappers(),
})

// Give the knex object to objection.
Model.knex(knex)
