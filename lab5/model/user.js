const { Schema, model } = require('mongoose'); 

class User {
    static schema = new Schema({
        email: String,
        password: String,
        permissions: Array
    });

    email;
    password;
    permissions;

    constructor(email, password, permissions) {
        this.email=email;
        this.password=password;
        this.permissions=permissions;
    }
}

const UserModel = model('User', User.schema);

module.exports = {
    User,
    UserModel
}