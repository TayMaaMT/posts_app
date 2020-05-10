const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { creat, delet, genarateAuthToken, getuser, findByCredentials, update, find } = require('../models/user');

router.get('/users', async(req, res) => {
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
        await update('users', { id: req.id }, { name, birthday, bio });
        if (name) {
            await update('posts', { user_id: req.id }, { username: name });
            await update('likes', { user_id: req.id }, { username: name });
            await update('comments', { user_id: req.id }, { username: name });
        }
        res.status(200).json({ Success: "update" });
    } catch (err) {
        res.status(400).json({ Error: err })
    }
})

router.post('/addPost', auth, async(req, res) => {
    try {
        const { content } = req.body;
        const postDate = new Date();
        const user_id = req.id;
        const user = await find('users', { id: user_id })
        const username = user[0].name;
        const post_id = await creat('posts', { content, postDate, user_id, username });
        res.status(200).json({ Success: "add post" });
    } catch (err) {
        res.status(400).json({ Error: err })
    }

})

router.get('/posts', auth, async(req, res) => {
    try {
        const posts = await find('posts');
        for (let post in posts) {
            const comments = await find('comments', { post_id: posts[post].id })
            const likes = await find('likes', { post_id: posts[post].id })
            posts[post].comments = comments;
            posts[post].likes = likes;
        }
        res.status(200).json({ posts });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }

})


router.post('/addcomment', auth, async(req, res) => {
    try {
        const { content, post_id } = req.body;
        const commentDate = new Date();
        const user_id = req.id;
        const user = await find('users', { id: user_id })
        const username = user[0].name;
        const comment = await creat('comments', { content, commentDate, post_id, user_id, username });
        const post = await find('posts', { id: post_id })
        const numbercomments = post[0].numbercomments + 1;
        await update('posts', { id: post_id }, { numbercomments });
        res.status(200).json({ Success: "add comment" });
        req.io.emit(`post_${post_id}`, { new_comment: { id: comment, content, commentDate, post_id, user_id, username }, numbercomments })
    } catch (err) {
        res.status(400).json({ Error: err })
    }


});

router.post('/addlike', auth, async(req, res) => {
    try {
        const { post_id } = req.body;
        const likeDate = new Date();
        const user_id = req.id;
        const user = await find('users', { id: user_id })
        const username = user[0].name;
        const like = await creat('likes', { likeDate, post_id, user_id, username });
        const post = await find('posts', { id: post_id })
        const numberlikes = post[0].numberlikes + 1;
        await update('posts', { id: post_id }, { numberlikes });
        res.status(200).json({ Success: "add like" });
        req.io.emit(`post_${post_id}`, { new_Like: { id: like, likeDate, post_id, user_id, username }, numberlikes })
    } catch (err) {
        res.status(400).json({ Error: err })
    }
});

router.post('/editComment', auth, async(req, res) => {
    try {
        const { content, id } = req.body;
        const commentDate = new Date();
        const user_id = req.id;
        const user = await find('comments', { user_id })
        if (user[0]) {
            await update('comments', { id }, { content, commentDate });
            res.status(200).json({ Success: "edit" });
            req.io.emit(`comment_${id}`, { edit_comment: { content, commentDate } })
        } else {
            throw "cannot edit this comments"
        }

    } catch (err) {
        res.status(400).json({ Error: err })
    }
})

router.post('/deletComment', auth, async(req, res) => {
    try {
        const { id } = req.body;
        const user_id = req.id;
        const user = await find('comments', { user_id })
        if (user[0]) {
            const post = await find('posts', { id: user[0].post_id })
            const numbercomments = post[0].numbercomments - 1;
            await update('posts', { id: user[0].post_id }, { numbercomments });
            await delet('comments', { id });
            res.status(200).json({ Success: "delete" });
            req.io.emit(`post_${ user[0].post_id}`, { delete_comment: { id }, numbercomments })
        } else {
            throw "your cant delete comment"
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
})



router.post('/deletLike', auth, async(req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.id;
        const user = await find('likes', { user_id, post_id })
        console.log(user[0].id);
        if (user[0]) {
            const post = await find('posts', { id: post_id })
            const numberlikes = post[0].numberlikes - 1;
            await update('posts', { id: post_id }, { numberlikes });
            await delet('likes', { id: user[0].id });
            res.status(200).json({ Success: "delete" });
            req.io.emit(`post_${user[0].id}`, { delete_Like: { id: user[0].id }, numberlikes })
        } else {
            throw "your cant remove this like"
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
})


module.exports = router;