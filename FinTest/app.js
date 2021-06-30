let express = require('express');
let http = require('http');
let app = express();
let server = http.createServer(app).listen(80);

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

let mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test'
});
connection.connect();


app.get('/app', function(req, res) { //mainPage
  res.sendfile("main.html");
});


app.get('/totalScore', function(req, res) { //총점순 조회
  console.log("aaaaa");
  connection.query(`SELECT * FROM student WHERE javascript+python+java = (SELECT max(javascript+python+java) FROM student)`,
    function(error, results, fields) {
      console.log("hihih");
      console.log(results);
      if (error) throw error
      res.send(results)
    }
  )
});


app.get('/selectScore', function(req, res) { //특정 과목 순 조
  connection.query(`SELECT * FROM student WHERE ${req.query.option}= (SELECT MAX(${req.query.option}) FROM student)`,
    function(error, results, fields) {
      console.log(results);
      res.send(results)
    }
  )
});



app.get('/insertForm', function(req, res) { //인서트 페이지로 이동
  res.sendfile("insertPage.html");
});


app.post('/insert', function(req, res) { //데이터 삽입
  let studentNo = req.body.studentNo
  let studentName = req.body.studentName
  let javascript = req.body.javascript
  let python = req.body.python
  let java = req.body.java
  let message = ""
  connection.query(`SELECT * FROM student
    WHERE studentNo = '${studentNo}'`,
    function(error, results, fields) {
      console.log(results);
      if (results.length == 0) {
        connection.query(`INSERT INTO student (studentNo, studentName, javascript , python, java)
    VALUES('${studentNo}','${studentName}',${javascript},${python},${java})`,
          function(error, results, fields) {
            console.log(results);
            if (results.affectedRows == 1) {
              message = "입력되었습니다."
              res.send(message)
            }
          });
      } else if (results.length == 1) { //1일때
        message = "동일한 학번의 학생이 존재합니다."
        res.send(message);
      }

    });
});

app.get('/listForm', function(req, res) { //전체 리스트 조회 페이지로 이동
  res.sendfile("listPage.html");
});


app.get('/list', function(req, res) { //리스트 쿼리
  connection.query(`SELECT * FROM student`,
    function(error, results, fields) {
      if (error) throw error
      console.log(results);
      res.send(results)
    });
});


app.get('/update', function(req, res) { //업데이트 페이지
  res.sendfile("updatePage.html");
});

app.get('/getOneStudent', function(req, res) { //기본값 설정을 위한 조회 쿼리
  connection.query(`SELECT * FROM student where no = ${req.query.no}`,
    function(error, results, fields) {
      if (error) throw error
      console.log(results);
      res.send(results)
    });
});


app.post('/updateStd', function(req, res) { //업데이트 쿼리
  let no = req.body.no
  let studentName = req.body.studentName
  let javascript = req.body.javascript
  let python = req.body.python
  let java = req.body.java

  connection.query(`UPDATE student SET studentName='${studentName}', javascript=${javascript} , python=${python} , java=${java}  WHERE no = '${no}' `,
    function(error, results, fields) {
      console.log(results);
      if (results.affectedRows == 1) {
        let message = "수정이 완료되었습니다."
        res.send(message)
      } else {
        console.log(results);
        let message = "수정에 실패했습니다."
        res.send(message)
      }
    });
});


app.post('/delete', function(req, res) { //삭제쿼리
  connection.query(`DELETE FROM student WHERE no = ${req.body.no}`,
    function(error, results, fields) {
      console.log(results);
      if (results.affectedRows == 1) {
        res.send("ok")
      } else {
        res.send("error")
      }
    });
});
