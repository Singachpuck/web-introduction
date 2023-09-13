const express = require('express');
const dotenv = require('dotenv');
const { join } = require('path');
const mongoose = require('mongoose');

const { User } = require('./model/user');
const { login, signup } = require('./service/auth_servise');
const { createUser } = require('./service/dao_service');


const app = express();

dotenv.config();

app.use('/static', express.static('static'));
app.use('/api', express.json());

app.get('/', (request, response) => {
  response.sendFile(join(__dirname, 'templates', 'index.html'));
});

app.post('/api/auth/token', async (req, res) => {
    try {
        const tokenPayload = await login(req.body);
        res.json(tokenPayload);
    } catch (e) {
        res.status(400).json({
            status: 'KO',
            error: e.message
        });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        await signup(req.body);
        res.json({
            status: 'OK',
            message: 'User created.'
        });
    } catch (e) {
        res.status(400).json({
            status: 'KO',
            error: e.message
        });
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