const express = require('express')
const ejs = require('ejs')

const app = express();

app.engine('ejs', ejs.renderFile)
app.use(express.static('public'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

// top page
const data = {
    'taro': 'taro@yamada.com',
    'hanako': 'hanako@flower.com',
    'sachiko': 'sachico@happy.com',
    'ichiro': 'ichiro@baseball'
}

app.get('/', (req, res)=> {
    let msg = `This is Index Page! <br>
    これはトップページです。
    `
    const url = '/other?name=taro&pass=yamada'
    res.render('index.ejs', {
        title: 'Index',
        content: msg,
        data: data
    })
})

app.post('/', (req, res)=> {
    let msg = `This is Posted Page!<br>
    You sent <b>${req.body.message}</b>
    `
    res.render('index.ejs', {
        title: 'Posted',
        content: msg,
        data: data
    })
})

// other page
app.get('/other', (req, res) => {
    let name = req.query.name;
    let pass = req.query.pass;
    let msg = `Your name is ${name} <br>
    Your password is ${pass}
    `
    res.render('index.ejs', {
        title: 'Other',
        content: msg,
    })
})

const server = app.listen(3000, () => {
    console.log('Server is running')
})