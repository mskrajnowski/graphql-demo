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
                    from: "posts.authorId",
                    to: "people.id",
                },
            },
            likes: {
                relation: Model.HasManyRelation,
                modelClass: PostLike,
                join: {
                    from: "posts.id",
                    to: "post_likes.postId",
                },
            },
            likedBy: {
                relation: Model.ManyToManyRelation,
                modelClass: Person,
                join: {
                    from: "posts.id",
                    through: {
                        from: "post_likes.postId",
                        to: "post_likes.personId",
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
