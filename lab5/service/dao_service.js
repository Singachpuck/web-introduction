const { UserModel, User } = require('./../model/user');

async function getUsers() {
    let users = await UserModel.find().exec();
    if (users === null) {
        return null;
    } 
    return users.map(u => new User(u.email, u.password, u.permissions));
}

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

async function updateUser(oldEmail, newEmail) {
    const exists = await userExists(newEmail);
    if (exists) {
        throw new Error(`User ${newEmail} is already registered.`);
    }

    return await UserModel.updateOne({ email: oldEmail }, { email: newEmail });
}

async function deleteUser(email) {
    const exists = userExists(email);
    
    if (!exists) {
        throw new Error(`User ${email} doesn't exist.`);
    }

    return await UserModel.deleteOne({ email });
}

module.exports = {
    getUserByEmail,
    createUser,
    userExists,
    updateUser,
    deleteUser,
    getUsers
}