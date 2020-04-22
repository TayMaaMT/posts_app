const exprss = require('express');
const cors = require('cors');
const user = require('./routes/user');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const app = exprss();
require("./config/db");
app.use(cors({
    credentials: true
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', user);
app.get('/', (req, res) => {

    res.send('Wellcom to Karaz API .... ');

});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("your server is running on port " + port);
})