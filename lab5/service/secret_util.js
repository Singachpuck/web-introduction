const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

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

function verifyAdmin(request) {
    let verify = verifyJwt(request);
    return Boolean(verify) && verify.permissions.includes('ADMIN');
}

module.exports = {
    generateJwt,
    validateJwtCookie,
    verifyJwt,
    verifyAdmin
}