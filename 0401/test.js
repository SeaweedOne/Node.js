let express = require('express');
let http = require('http');
let app = express();
let server = http.createServer(app).listen(80);

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


let mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'test'
});
connection.connect();

app.get('/test', function(req, res) {
  res.sendfile("test.html");
});
