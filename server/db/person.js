const { Model } = require("objection")

class Person extends Model {
    static get tableName() {
        return "people"
    }

    static get relationMappings() {
        const Post = require("./post")

        return {
            posts: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: "people.id",
                    to: "posts.author_id",
                },
            },
        }
    }

    $beforeInsert() {
        this.created_at = new Date()
        this.updated_at = new Date()
    }

    $beforeUpdate() {
        this.updated_at = new Date()
    }
}

module.exports = Person