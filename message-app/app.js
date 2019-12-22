const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8')

const server = http.createServer(getFromClient);
server.listen(3000);

function getFromClient(req, res) {
    const url_parts = url.parse(req.url, true);
    switch (url_parts.pathname) {
        case '/':
            res_index(req, res);
            break
        default:
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('no page...');
            break;
    }
}

// data
let data = {msg: 'no message...'}

// access to index
function res_index(req, res){
    // POST
    if (req.method =='POST'){
        let body ='';
        req.on('data', (data) => {
            body += data;
        });

        req.on('end', () => {
            data = qs.parse(body);
            // save cookie
            setCookie('msg', data.msg, res);
            write_index(req, res);
        });
    } else {
        write_index(req, res);
    }
}

// make index page
function write_index(req, res){
    const msg = "Display message"
    const cookie_data = getCookie('msg', req);
    const content = ejs.render(index_page, {
        title: "Index",
        content: msg,
        data: data,
        cookie_data: cookie_data
    });
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(content);
    res.end()
}

// set cookie value
function setCookie(key, val, res){
    const cookie = encodeURI(val);
    res.setHeader('Set-Cookie', [key + '=' + cookie]);
}
// get cookie value
function getCookie(key, req){
    const cookie_data = req.headers.cookie != undefined ? req.headers.cookie: '';
    const data = cookie_data.split(';');
    for(let i in data){
        if (data[i].trim().startsWith(key + '=')) {
            const result = data[i].trim().substring(key.length + 1);
            return decodeURI(result);
        }
    }
    return '';
}