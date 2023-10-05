const express=require("express")
const app=express()
const router=require("./router/router1")
const dotenv = require('dotenv');
dotenv.config(); 



app.use(express.urlencoded({extended:true}))


app.use(express.json())

app.use("/api",router)
const port=process.env.port
app.listen(port,(err)=>{
    if(err)console.log(err)

    else console.log("server running on port 4000")
})
