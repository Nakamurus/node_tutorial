const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=> {
    let msg = 'Write whatever you want and send it!';
    if (req.session.message != undefined){
        msg = `Last Message: ${req.session.message}`
    }
    let name = req.query.name;
    let mail = req.query.mail;
    let data = {
        title: 'Hello!',
        content: `Your name is ${name}
        Your mail adress is ${mail}`,
        msg: msg
    };
    res.render('hello', data)
});

router.post('/post', (req, res, next)=> {
    let msg = req.body['message'];
    req.session.message = msg;
    let data = {
        title: 'Hello!',
        content: `You send "${msg}".`,
        msg: `Last Message ${req.session.message}`
    };
    res.render('hello', data)
})

module.exports = router;