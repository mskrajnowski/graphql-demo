const { Model } = require("objection")

class Post extends Model {
    static get tableName() {
        return "posts"
    }

    static get relationMappings() {
        const Person = require("./person")

        return {
            author: {
                relation: Model.BelongsToOneRelation,
                modelClass: Person,
                join: {
                    from: "posts.author_id",
                    to: "people.id",
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

module.exports = Post
