const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'Admin@123';

function generateJwt({ email, permissions }) {
    return jwt.sign({ email, permissions }, process.env.TOKEN_SECRET, { expiresIn: 3600 });
} 

module.exports = {
    generateJwt
}