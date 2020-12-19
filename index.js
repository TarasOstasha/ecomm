const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productRouter = require('./routes/admin/products');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['lkasld235j']
}));
app.use(authRouter);
app.use(productRouter);



app.listen(port, () => {
    console.log(`run server on port ${port}`); 
});

