const { UserModel, User } = require('./../model/user');

async function getUserByEmail(email) {
    let userModel = await UserModel.findOne({ email: email }).exec();
    if (userModel == null) {
        return null;
    }
    return new User(userModel.email, userModel.password, userModel.permissions);
}

async function createUser(user) {
    await new UserModel(user).save();
}

async function userExists(email) {
    return await UserModel.exists({ email });
}

module.exports = {
    getUserByEmail,
    createUser,
    userExists
}