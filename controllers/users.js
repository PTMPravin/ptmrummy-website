const mysql = require("mysql");
const bcrybt = require("bcryptjs");


const db = mysql.createConnection({
    host : process.env.DATABASE_HOST , 
    user : process.env.DATABASE_USER , 
    password : process.env.DATABASE_PASSWORD , 
    database : process.env.DATABASE , 
}) ;

exports.login = async(req,res)=>{
    try{
        const email = req.body.email ;
        const password = req.body.password ;
        if(!email || !password){
            return res.status(777).render("login",{msg : "Please Enter Your E_Mail And Password" , msg_type : "error"})
        }
        db.query(
            "select * from user where email=?",
            [email],
            async (error , result)=>{
                console.log(result);
                if(!result){
                    return res.status(401).render("login",{msg : "E_Mail Id Or Password Incorrect..." , msg_type : "error"})
                }
                else{
                    if(!(await bcrybt.compare(password,result[0].PASSWORD))){
                        return res.status(401).render("login",{msg : "E_Mail Id Or Password Incorrect..." , msg_type : "error"})
                    }
                    else{
                        return res.status(401).render("rummy")
                    }
                }
            }
        )
    }
    catch(error){
        console.log(error);
    }
};
exports.register = (req , res)=>{
   // res.send("Form Sunbmitted");
    console.log(req.body);
    const name = req.body.name ;
    const email = req.body.email ;
    const password = req.body.password ;
    const confirm_password = req.body.confirm_password ;

 //  const { name , email , password , confirm_password } = req.body ;

//    console.log(name) ;
//    console.log(email) ;
//    console.log(password) ;
//    console.log(confirm_password) ;


db.query("select email from user where email=?",[email],async (error,result)=>{
    if(error)
    {
        console.log(error);
    }


    if(result.length>0)
    {
        return res.render('register',{msg : "E_Mail Id Already Taken" , msg_type : "error"});
    }


    else if(password!==confirm_password)
    {
        return res.render('register',{msg : "Password Does Not Match" , msg_type : "error"});
    }


    let hashedPassword = await bcrybt.hash(password,7);
    //console.log(hashedPassword);


    db.query("insert into user set ?" , 
            { name : name , email : email , password : hashedPassword} ,
                (error,result)=>{
                    if(error)
                    {
                        console.log(error) ; 
                    }
                    else
                    {
                        console.log(result);
                        return res.render('register',{msg : "User Registration Success" , msg_type : "good"});
                    }
                }
            )
});
};

exports.forget = async(req , res)=>{
    try{
        const email = req.body.email ;
        const new_password = req.body.new_password ;
        const confirm_new_password = req.body.confirm_new_password ; 
        // console.log(email);
        // console.log(new_password);
        // console.log(confirm_new_password);
        if(!email||!new_password||!confirm_new_password){
            return res.status(401).render("forget",{msg : "Please Enter Your E_Mail And Passwords" , msg_type : "error"}) ;
           // console.log("Please Enter Your E_Mail And Passwords");
        }
        db.query("select * from user where email=?",[email],async(error,result)=>{
            if(result.length<=0){
                return res.status(777).render("forget",{msg : "E_Mail Id In Correct" , msg_type : "error"}) ;
            }
            if(new_password!==confirm_new_password)
            {
                return res.status(401).render("forget",{msg : "Password Doesn't Match" , msg_type : "error"}) ;
               //console.log("Password Does't Match");
            }
            else{
                let hashedPassword = await bcrybt.hash(new_password,7);
                db.query("UPDATE user SET password=? WHERE email=?",[hashedPassword,email],(error,result)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log(result);
                        return res.render("forget",{msg : "Password Changed" , msg_type : "good"});
                    }
                })
            }
        })
     }
     catch(error){
        console.log(error);
    }

}