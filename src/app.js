const exprss = require('express');
const cors = require('cors');
const user = require('./routes/user');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const socketio = require('socket.io');
const app = exprss();
require("./config/db");
const port = process.env.PORT || 3000;
const serverexpress = app.listen(port, () => {
    console.log("your server is running on port " + port);
})
const io = socketio(serverexpress);
app.use(cors({
    credentials: true
}))

io.on('connection', function(socket) {
    console.log('client connect');
});

app.use(function(req, res, next) {
    req.io = io;
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', user);
app.get('/', (req, res) => {
    req.io.emit('hi', { hi: "taymaa" })

    res.send('Wellcom to Karaz API .... ');

});