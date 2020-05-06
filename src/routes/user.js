const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { creat, genarateAuthToken, getuser, findByCredentials, update, find } = require('../models/user');

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
router.get('/profile', auth, async(req, res) => {
    try {
        const user = await find('users', { id: req.id })
        res.status(200).json({ user });
    } catch (err) {
        res.status(400).json({ Error: "Connot find user" })
    }

})

router.post('/update', auth, async(req, res) => {
    try {
        const { name, birth, bio } = req.body;
        const birthday = new Date(birth);
        const data = await update('users', req, { name, birthday, bio });
        res.status(200).json({ Success: "update" });
    } catch (err) {
        res.status(400).json({ Error: err })
    }
})

router.post('/addPost', auth, async(req, res) => {
    const { content } = req.body;
    const postDate = new Date();
    const user_id = req.id;
    const post_id = await creat('posts', { content, postDate, user_id });
    res.status(200).json({ Success: "add post" });
})
router.get('/posts', auth, async(req, res) => {
    try {
        const posts = await find('posts');
        await posts.map(async(post) => {
            const user = await find('users', { id: post.user_id });
            post.userName = user[0].name;

            return post;
        })
        console.log(posts);
        res.status(200).json({ posts });
    } catch (err) {
        res.status(400).json({ Error: err })
    }


})
router.post('/addcomment');
module.exports = router;