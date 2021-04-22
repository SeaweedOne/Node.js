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
  database : 'news'
});
connection.connect();


app.get('/newspage', function(req, res) {
  res.sendfile("news.html");
});

app.get('/testnews', function (req, res) {
  connection.query(`SELECT * FROM news where No=${req.query.no}`,
function (error, results, fields) {
  console.log(results);
   res.send(results)
  });
});

app.get('/testnews2', function (req, res) {
  connection.query(`SELECT * FROM news where title='${req.query.name}'`,
function (error, results, fields) {
  if(error) throw error
  console.log(results);
   res.send(results)
  });
});

app.post('/news', function (req, res) {
  connection.query(`INSERT INTO news (title, content)
VALUES
('${req.body.title}','${req.body.content}')`,
function (error, results, fields) {
  if(error) {
    res.send("not ok")
  }
  else if(results.affectedRows ==1){
    res.send("ok")
  }
  // console.log(results);
  //  res.send(results)
  });
});
