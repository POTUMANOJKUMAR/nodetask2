const express=require("express")
const app=express()
const router=require("./router/router1")




app.use(express.urlencoded({extended:true}))


app.use(express.json())

app.use("/api",router)

app.listen(3000,(err)=>{
    if(err)console.log(err)

    else console.log("server running on port 4000")
})
