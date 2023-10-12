const jwt = require('jsonwebtoken');

function generateJwt({ email, permissions }) {
    return jwt.sign({ email, permissions }, process.env.TOKEN_SECRET, { expiresIn: 3600 });
}

function validateJwtCookie(cookie) {
    const decodedToken = atob(cookie);
    const token = JSON.parse(decodedToken);
    return jwt.verify(token.token, process.env.TOKEN_SECRET);
}

function verifyJwt(request) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return null;

    return jwt.verify(token, process.env.TOKEN_SECRET);
}

module.exports = {
    generateJwt,
    validateJwtCookie,
    verifyJwt
}