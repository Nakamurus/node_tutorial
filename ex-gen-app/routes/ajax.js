const express = require('express');
const router = express.Router();

let data = [
    {name: 'Taro', age: '23', mail: 'taro@yamada'},
    {name: 'Hanako', age: '22', mail: 'hanako@flower'},
    {name: 'Sachiko', age: '34', mail: 'sachiko@happy'}
]

router.get('/', (req, res, next) => {
    let n = req.query.id;
    res.json(data[n]);
});

module.exports = router;