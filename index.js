const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const usersRepo = require('./repositories/users');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `)
});

// how to create body parser manually !!!
// const bodyParser = (req, res, next) => {
//     if (req.method === 'POST') {
//         req.on('data', data => {
//             const parsed = data.toString('utf-8').split('&');
//             const formData = {};
//             for (let pair of parsed) {
//                 const [key, value] = pair.split('=');
//                 //console.log(key);
//                 //console.log(value);
//                 formData[key] = value;
//             }
//             req.body = formData;
//             //console.log(req.body, 'this is req.body!!!!');
//             next();
//         });
//     } else {
//         next();
//     }
// };

app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if(existingUser) {
        return res.status(400).send('Email in use');
    }

    if(password !== passwordConfirmation) {
        return res.status(400).send('Passwords must match');
    }

    res.send('Account Created!')
});







app.listen(port, () => {
    console.log(`run server on port ${port}`); 
});