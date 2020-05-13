const jwt = require('jsonwebtoken');

const auth = async(req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        if (!user) {
            res.status(400).send({ Error: "please authanticate" });
        }
        req.token = token;
        req.id = user.id;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send({ Error: "somthing gooing wrong" });
    }

}

module.exports = auth;