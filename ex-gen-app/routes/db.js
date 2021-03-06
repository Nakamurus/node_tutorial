const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('mydb.sqlite3');

const knex = require('knex') ({
    client: 'sqlite3',
    connection: {
        filename: 'mydb.sqlite3'
    },
    useNullAsDefault: true
});
const Bookshelf = require('bookshelf')(knex);

const MyData = Bookshelf.Model.extend({
    // as arguments of extend you write config info about model
    tableName: 'mydata'
});
// Model is an object to use a table in database


router.get('/', (req, res, next)=> {
    new MyData().fetchAll().then((collection) => {
        let data = {
            title: 'DB!',
            content: collection.toArray()
        };
        res.render('db/index', data)
    })
    .catch((err) => {
        res.status(500).json({error: true, data: {message: err.message}});
    });
    // Below is done without BookShelf
    // // シリアライズ（直列化）とは、用意した処理を重ならずに連続実行する処理
    // db.serialize(()=> {
    //     // retrieve all record
    //     db.all('select * from mydata', (err, rows) => {
    //         // handling when finished access to database
    //         if(!err) {
    //             let data = {
    //                 title: 'Hello!',
    //                 content: rows //retrieved record
    //              };
    //              res.render('db/index', data);
    //         }
    //     })
    // })
})

router.get('/add', (req, res, next) => {
    let data = {
        title: 'DB/Add',
        content: 'Input new record:',
        form: {name: '', mail:'', age: 0}
    }
    res.render('db/add', data);
});

router.post('/add', [
    check('name').notEmpty().withMessage('Enter a name'),
    check('mail').isEmail().withMessage('Enter your mail address'),
    check('age').matches(/\d/).withMessage('Password must contain number')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    new MyData(req.body).save().then((model) => {
        res.redirect('/db')
    })
    // below is another option without BookShelf
    // let nm = req.body.name;
    // let ml = req.body.mail;
    // let ag = req.body.age;
    // db.run('insert into mydata (name, mail, age) values (?, ?, ?)', nm, ml, ag);
    // // db.runはデータベースからレコードを取り出す必要がないときに使う（→コールバックも不要）
    // // insert into TABLE (FIELD1, FIELD2, ...) values (VALUE1, VALUE2...);
    // res.redirect('/db')
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

router.get('/find', (req, res, next) => {
    let data = {
        title: 'DB/find',
        content: 'Input search ID',
        form: {fstr: ''},
        mydata: null
    };
    res.render('db/find', data)
});

router.post('/find', (req, res, next) => {
    new MyData().where('id', '=', req.body.fstr).fetch()
    .then((collection) => {
        let data = {
            title: 'DB!',
            content: `search result of #id = ${req.body.fstr} `,
            form: req.body,
            mydata: collection
        };
        res.render('db/find', data)
    })
})

router.get('/:page', (req, res, next) => {
    let pg = req.params.page;
    pg *= 1;
    if (pg < 1){pg = 1}
    new MyData().fetchPage({page:pg, pageSize:3})
    .then((collection) => {
        let data = {
            title: 'DB',
            content: collection.toArray(),
            pagination: collection.pagination
        };
        console.log(collection.pagination);
        res.render('db/index', data);
    })
    .catch((err) => {
        res.status(500).json({error: true, data: {message: err.message}})
    });
});

module.exports = router;