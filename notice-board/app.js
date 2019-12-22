// Main program
const http = require('http');
const fs = require('fs')
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const login_page = fs.readFileSync('./login.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

const max_num = 10;
const filename = 'mydata.txt';
let message_data;
readFromFile(filename)

const server = http.createServer(getFromClient);
server.listen(3000);

// handle createServer
function getFromClient(req, res) {
    let url_parts = url.parse(req.url, true);
    switch (url_parts.pathname) {
        case '/':
            res_index(req, res);
            break;

        case '/login':
            res_login(req, res);
            break;

        case '/style.css':
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(style_css);
            res.end();
            break;

        default:
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('no page...');
            break;
    }
}

// handling access to LOGIN
function res_login(req, res){
    const content = ejs.render(login_page, {});
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(content)
    res.end();
}

// handling access to index
function res_index(req, res) {
    //  handling POST access
    if (req.method == 'POST'){
        let body = '';
        // handling event when receiving data
        req.on('data', (data)=> {
            body += data;
        });

        // handling even when finished receicing data
        req.on('end', ()=> {
            data = qs.parse(body);
            addToData(data.id, data.msg, filename, req);
            write_index(req, res);
        });
    } else {
        write_index(req, res);
    }
}

// make index page
function write_index(req, res) {
    const msg = "Write whatever you want!";
    let content = ejs.render(index_page, {
        title: 'INDEX',
        content: msg,
        data: message_data,
        filename: 'data_item'
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(content);
    res.end();
}

// load text file
function readFromFile(fname) {
    fs.readFile(fname, 'utf8', (err, data) => {
        message_data = data.split('\n');
    })
}

// update data
function addToData(id, msg, fname, req) {
    let obj = {'id': id, 'msg': msg};
    let obj_str = JSON.stringify(obj);
    console.log('add data: ' + obj_str);
    message_data.unshift(obj_str)
    if (message_data.length > max_num){
        message_data.pop();
    }
    saveToFile(fname);
}

// save data
function saveToFile(fname) {
    let data_str = message_data.join('\n');
    fs.writeFile(fname, data_str, (err)=> {
        if(err) {throw err;}
    });
}