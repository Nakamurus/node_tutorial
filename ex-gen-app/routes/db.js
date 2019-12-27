const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('mydb.sqlite3');

router.get('/', (req, res, next)=> {
    // シリアライズ（直列化）とは、用意した処理を重ならずに連続実行する処理
    db.serialize(()=> {
        // retrieve all record
        db.all('select * from mydata', (err, rows) => {
            // handling when finished access to database
            if(!err) {
                let data = {
                    title: 'Hello!',
                    content: rows //retrieved record
                 };
                 res.render('db/index', data);
            }
        })
    })
})

router.get('/add', (req, res, next) => {
    let data = {
        title: 'DB/Add',
        content: 'Input new record:'
    }
    res.render('db/add', data);
});

router.post('/add', (req, res, next) => {
    let nm = req.body.name;
    let ml = req.body.mail;
    let ag = req.body.age;
    db.run('insert into mydata (name, mail, age) values (?, ?, ?)', nm, ml, ag);
    // db.runはデータベースからレコードを取り出す必要がないときに使う（→コールバックも不要）
    // insert into TABLE (FIELD1, FIELD2, ...) values (VALUE1, VALUE2...);
    res.redirect('/db')
})

router.get('/show', (req, res, next) => {
    let id = req.query.id;
    db.serialize(() => {
        let q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            // get only one record
            if (!err) {
                let data = {
                    title: 'DB/show',
                    content: ` record with id ${id}: `,
                    mydata: row
                }
                res.render('db/show', data);
            }
        })
    })
})

router.get('/edit', (req, res, next) => {
    let id = req.query.id;
    db.serialize( () => {
        let q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                let data = {
                    title: 'DB/edit',
                    content: `edit a record with an id {id}`,
                    mydata: row
                }
                res.render('db/edit', data);
            }
        })
    })
})

router.post('/edit', (req, res, next) => {
    let id = req.body.id;
    let nm = req.body.name;
    let ml = req.body.mail;
    let ag = req.body.age;
    let q = "update mydata set name = ?, mail = ?, age = ? where id = ?";
    db.run(q, nm, ml, ag, id);
    res.redirect('/db');
})

router.get('/delete', (req, res, next) => {
    let id = req.query.id;
    db.serialize(() => {
        let q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                let data = {
                    title: 'DB/delete',
                    content: `delete a record with an id = ${id}:`,
                    mydata: row
                }
                res.render('db/delete', data);
            }
        })
    })
})

router.post('/delete', (req, res, next) => {
    let id = req.body.id;
    let q = "delete from mydata where id = ?";
    db.run(q, id);
    res.redirect('/db');
})

module.exports = router;