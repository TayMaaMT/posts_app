const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { creat, find, genarateAuthToken, getuser, findByCredentials } = require('../models/user');

router.get('/signup', async(req, res) => {
    try {
        const users = await getuser();
        res.status(200).json({ users });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})

router.post('/signup', async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 8);
        const user_id = await creat('users', { name, email, password: hashPassword });
        const token = genarateAuthToken(user_id);
        res.status(200).json({ token: token });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err });
    }
})

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user_id = await findByCredentials(email, password);
        const token = genarateAuthToken(user_id);
        res.status(200).json({ token: token });
    } catch (err) {
        res.status(400).json({ Error: "Unable to login" })
    }
})
module.exports = router;