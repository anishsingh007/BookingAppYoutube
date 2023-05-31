const express = require("express");
const app = express();

const mysql = require("./connection").con;
//configuration
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

// app.use(express.urlencoded())
// app.use(express.json())
//routing
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/add", (req, res) => {
  res.render("add");
});
app.get("/search", (req, res) => {
  res.render("search");
});
app.get("/update", (req, res) => {
  res.render("update");
});
app.get("/delete", (req, res) => {
  res.render("delete");
});
app.get("/view", (req, res) => {
     let qry = "SELECT * FROM data ";
    mysql.query(qry,(err,results)=>{
        if (err) throw err
        else{
            res.render('view',{data:results})
        }
    })
});

app.get("/addstudent", (req, res) => {
  const { name, phone, email, gender } = req.query;

  //sanitization xss
  let qry = "SELECT * FROM data WHERE emailid = ? OR phoneno = ?";
  mysql.query(qry, [email, phone], (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.length > 0) {
        // Handle the case when the email or phone already exists
        res.render("add", { checkmesg: true });
      } else {
        let qry2 = "INSERT INTO data VALUES (?, ?, ?, ?)";
        mysql.query(qry2, [name, phone, email, gender], (err, results) => {
          if (err) {
            throw err;
          } else if (results.affectedRows > 0) {
            res.render("add", { mesg: true });
          }
        });
      }
    }
  });
});

app.get("/searchstudent", (req, res) => {
  //fetch data from form
  const { phone } = req.query;
  let qry = "SELECT * FROM data WHERE phoneno = ?";
  mysql.query(qry, [phone], (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.length > 0) {
        res.render("search", { mesg1: true, mesg2: false });
      } else {
        res.render("search", { mesg1: false, mesg2: true });
      }
    }
  });
});

app.get("/updatesearch", (req, res) => {
  const { phone } = req.query;
  let qry = "SELECT * FROM data WHERE phoneno = ?";
  mysql.query(qry, [phone], (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.length > 0) {
        res.render("update", { mesg1: true, mesg2: false,data:results });
      } else {
        res.render("update", { mesg1: false, mesg2: true });
      }
    }
  });
});

app.get("/updatestudent", (req, res) => {
  const { phone, name, gender } = req.query;
  let qry = "update data set name=?,gender=? where phoneno=?";

  mysql.query(qry, [name, gender, phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.affectedRows > 0) {
        res.render("update", { umesg: true });
      }
    }
  });
});
app.get("/removestudent", (req, res) => {
  const { phone } = req.query;
  let qry = "delete  FROM data WHERE phoneno = ?";
  mysql.query(qry, [phone], (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.affectedRows > 0) {
        res.render("delete", { mesg1: true, mesg2: false });
      } else {
        res.render("delete", { mesg1: false, mesg2: true });
      }
    }
  });
});

  

app.listen(8080);
