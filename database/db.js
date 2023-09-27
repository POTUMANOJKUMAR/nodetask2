const mysql=require("mysql2")
const connection=mysql.createConnection({
    "host":"localhost",
    "user":"root",
    "database":"products",
    "password":"1234"
})
connection.connect((err)=>{
if (err) console.log(err)
else console.log("Database connected successfully!")
})
module.exports=connection