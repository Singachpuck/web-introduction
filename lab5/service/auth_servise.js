const { User } = require('../model/user');
const { getUserByEmail, createUser, userExists } = require('./dao_service');
const { generateJwt } = require('./secret_util');

async function login({ email, password }) {
    const user = await getUserByEmail(email);

    if (user == null) {
        throw new Error(`User with email ${email} does not exist.`);
    }
    
    if (user.password != password) {
        throw new Error('Invalid password.');
    }

    return {
        email: user.email,
        token: generateJwt(user),
        expiresIn: 3600
    };
}

async function signup({ email, password }) {
    const exists = await userExists(email);
    
    if (exists) {
        throw new Error('User already exists.');
    }

    const user = new User(email, password, ['DEFAULT']);
    createUser(user);
}

module.exports = {
    login,
    signup
}