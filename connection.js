const mysql = require('mysql')
const con = mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'180828',
    database:'bookingapp',
    port:3306,

});

con.connect((err)=>{
    if(err) throw err;
    console.log('connection created');
})

module.exports.con=con;