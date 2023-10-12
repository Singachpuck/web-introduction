const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { join } = require('path');
const mongoose = require('mongoose');

const { User } = require('./model/user');
const { login, signup, composeJwt } = require('./service/auth_servise');
const { createUser, updateUser, deleteUser, getUserByEmail } = require('./service/dao_service');
const { validateJwtCookie, verifyJwt } = require('./service/secret_util');


const app = express();

dotenv.config();

app.use('/static', express.static('static'));
app.use('/api', express.json());
app.use(cookieParser());

app.get('/', (request, response) => {
  response.redirect('/home');
});

app.get('/home', (request, response) => {
    response.sendFile(join(__dirname, 'templates', 'home.html'));
});

app.get('/lab1', (request, response) => {
    response.sendFile(join(__dirname, 'templates', 'lab1.html'));
});

app.get('/login', (request, response) => {
    response.sendFile(join(__dirname, 'templates', 'login.html'));
});

app.get('/signup', (request, response) => {
    response.sendFile(join(__dirname, 'templates', 'signup.html'));
});


app.get('/content', (request, response) => {
    try {
        const decoded = validateJwtCookie(request.cookies.token);
        if (decoded.permissions.filter(permission => permission === 'DEFAULT' || permission === 'ADMIN').length === 0) {
            return response.status(403).sendFile(join(__dirname, 'templates', 'error', 'forbidden.html'));
        }
        return response.sendFile(join(__dirname, 'templates', 'content.html'));
    } catch (e) {
        console.log(e);
        return response.status(401).sendFile(join(__dirname, 'templates', 'error', 'unauthorized.html'));
    }
});

app.get('/admin', (request, response) => {
    try {
        const decoded = validateJwtCookie(request.cookies.token);
        if (decoded.permissions.filter(permission => permission === 'ADMIN').length === 0) {
            return response.status(403).sendFile(join(__dirname, 'templates', 'error', 'forbidden.html'));
        }
        return response.sendFile(join(__dirname, 'templates', 'admin.html'));
    } catch (e) {
        console.log(e);
        return response.status(401).sendFile(join(__dirname, 'templates', 'error', 'unauthorized.html'));
    }
});

app.get('/logout', (request, response) => {
    response.cookie('token', '', {
        expires: new Date(0)
    })
    response.redirect('/login');
});

app.post('/api/auth/token', async (req, res) => {
    try {
        const tokenPayload = await login(req.body);
        res.json(JSON.stringify(tokenPayload));
    } catch (e) {
        res.status(400).json(JSON.stringify({
            status: 'KO',
            error: e.message
        }));
    }
});

// GET
app.get('/api/auth/:email', async (req, res) => {
    try {
        if (!verifyJwt(req)) {
            return res.status(401).json(JSON.stringify({
                status: 'KO',
                error: 'Invalid JWT'
            }));
        }

        const user = await getUserByEmail(res.params.email);
        res.json(JSON.stringify({
            email: user.email,
            permissions: user.permissions
        }));
    } catch (e) {

    }
});

// POST
app.post('/api/auth/', async (req, res) => {
    try {
        await signup(req.body);
        res.json(JSON.stringify({
            status: 'OK',
            message: 'User created.'
        }));
    } catch (e) {
        res.status(400).json(JSON.stringify({
            status: 'KO',
            error: e.message
        }));
    }
});

// UPDATE
app.patch('/api/auth/:email', async (req, res) => {
    try {
        if (!verifyJwt(req)) {
            return res.status(401).json(JSON.stringify({
                status: 'KO',
                error: 'Invalid JWT'
            }));
        }

        const email = req.params.email;
        await updateUser(email, req.body.email);
        const user = await getUserByEmail(req.body.email);
        const tokenPayload = composeJwt(user);
        res.json(JSON.stringify(tokenPayload));
    } catch (e) {
        res.status(400).json(JSON.stringify({
            status: 'KO',
            error: e.message
        }));
    }
});

// DELETE
app.delete('/api/auth/:email', (req, res) => {
    try {
        if (!verifyJwt(req)) {
            return res.status(401).json(JSON.stringify({
                status: 'KO',
                error: 'Invalid JWT'
            }));
        }

        const email = req.params.email;
        deleteUser(email);
        res.sendStatus(204);
    } catch (e) {
        res.status(400).json(JSON.stringify({
            status: 'KO',
            error: e.message
        }));
    }
});

app.listen(3000, async () => {
    console.log('Server listening on port 3000.');
    try {
        await init();
    } catch (e) {
        console.error(e);
    }
});

async function init() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    let admin = new User(process.env['admin.email'], process.env['admin.password'], ['ADMIN']);
    let user = new User(process.env['user.email'], process.env['user.password'], ['DEFAULT']);

    await mongoose.connection.db.dropDatabase((err) => {
        console.error('Error dropping database:', err);
    });

    console.log('Cleared test database successfully.');
    await createUser(admin);
    await createUser(user);
}