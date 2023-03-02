const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
// const req = require('express/lib/request');
// const res = require('express/lib/response');
const app = express();


dotenv.config({
    path : "./.env" , 
})


const db = mysql.createConnection({
    host : process.env.DATABASE_HOST , 
    user : process.env.DATABASE_USER , 
    password : process.env.DATABASE_PASSWORD , 
    database : process.env.DATABASE , 
}) ;


db.connect((err)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("MySql Connection Success");
    }
})


app.use(express.urlencoded({extended : false}));


// console.log(__dirname);
const location = path.join(__dirname , "./Public");
 app.use(express.static(location));
 app.set("view engine","hbs");


 app.use("/" , require("./routes/routes"));
 app.use("/auth" , require("./routes/auth"))


app.listen(7777,()=>{
    console.log("Server Started @ Port 7777");
})