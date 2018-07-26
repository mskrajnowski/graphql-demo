const { Model } = require("objection")

class PostLike extends Model {
    static get tableName() {
        return "post_likes"
    }

    static get relationMappings() {
        const Person = require("./person")
        const Post = require("./post")

        return {
            person: {
                relation: Model.BelongsToOneRelation,
                modelClass: Person,
                join: {
                    from: "post_likes.person_id",
                    to: "people.id",
                },
            },
            post: {
                relation: Model.BelongsToOneRelation,
                modelClass: Post,
                join: {
                    from: "post_likes.post_id",
                    to: "posts.id",
                },
            },
        }
    }

    $beforeInsert() {
        this.created_at = new Date()
    }
}

module.exports = PostLike
