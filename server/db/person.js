const { Model } = require("objection")

class Person extends Model {
    static get tableName() {
        return "people"
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
