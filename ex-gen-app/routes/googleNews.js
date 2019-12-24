const express = require('express')
const router = express.Router();

const http = require('https');
const parseString = require('xml2js').parseString;

router.get('/', (req, res, next) => {
    let opt = {
        host: 'news.google.com',
        port: 443,
        path: '/rss?ie=UTF-8&oe=UTF-8&hl=en-US&gl=US&ceid=US:en'
    };
    http.get(opt, (res2) => {
        let body = '';
        res2.on('data', (data) => {
            body += data;
        });
        res2.on('end', () => {
            parseString(body.trim(), (err, result) => {
                let data = {
                    title: 'Hello!',
                    content: result.rss.channel[0].item
                };
                res.render('hello', data);
            })
        })
    })
})
module.exports = router;