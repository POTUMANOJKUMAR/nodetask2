const database=require("../database/db")
const customers=async(req,res)=>{
    const {name}=req.body;
    const insert=`insert into customers (name) values(?)`
    database.query(insert,[name],(err,result)=>{
        if(err) console.log(err)
        else res.send("posted!")
    })
}
module.exports={customers}