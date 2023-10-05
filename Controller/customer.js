const database=require("../database/db")
const customers=async(req,res)=>{
    try{ 
        const {name}=req.body;
    const [insert]=await database.query(`insert into customers (customer_name) values(?)`,[name])
   res.send("customer joined")
   
}
catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}}
module.exports={customers}