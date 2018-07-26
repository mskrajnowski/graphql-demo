const { Model } = require("objection")

class Person extends Model {
    static get tableName() {
        return "people"
    }

    static get relationMappings() {
        const Post = require("./post")
        const PostLike = require("./post-like")

        return {
            posts: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: "people.id",
                    to: "posts.authorId",
                },
            },
            likes: {
                relation: Model.HasManyRelation,
                modelClass: PostLike,
                join: {
                    from: "people.id",
                    to: "post_likes.personId",
                },
            },
            likedPosts: {
                relation: Model.ManyToManyRelation,
                modelClass: Post,
                join: {
                    from: "people.id",
                    through: {
                        from: "post_likes.personId",
                        to: "post_likes.postId",
                    },
                    to: "posts.id",
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
