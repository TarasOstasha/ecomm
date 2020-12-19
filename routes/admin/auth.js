const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExist, requireValidPasswordForUser } = require('./validators');


const router = express.Router();

// I DID VALIDATION WITH EXPRESS-VALIDATOR

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
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

router.post('/signup', 
    [requireEmail, requirePassword, requirePasswordConfirmation], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }

        const { email, password, passwordConfirmation } = req.body;
        // create a new user
        const user = await usersRepo.create({ email, password });
        // store id of that user inside the users cookie
        req.session.userId = user.id // added by cookie 


        res.send('Account Created!')
});


router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
})

router.post('/signin', 
        [requireEmailExist, requireValidPasswordForUser], 
        async (req, res) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.send(signinTemplate({ errors }));
            }
            const { email } = req.body;

            const user = await usersRepo.getOneBy({ email });
            req.session.userId = user.id; // set to cookies
            res.send('You are signed in!!!');
})


module.exports = router;