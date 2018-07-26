const { Model } = require("objection")

class Post extends Model {
    static get tableName() {
        return "posts"
    }

    static get relationMappings() {
        const Person = require("./person")
        const PostLike = require("./post-like")

        return {
            author: {
                relation: Model.BelongsToOneRelation,
                modelClass: Person,
                join: {
                    from: "posts.author_id",
                    to: "people.id",
                },
            },
            likes: {
                relation: Model.HasManyRelation,
                modelClass: PostLike,
                join: {
                    from: "posts.id",
                    to: "post_likes.post_id",
                },
            },
            liked_by: {
                relation: Model.ManyToManyRelation,
                modelClass: Person,
                join: {
                    from: "posts.id",
                    through: {
                        from: "post_likes.post_id",
                        to: "post_likes.person_id",
                    },
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
