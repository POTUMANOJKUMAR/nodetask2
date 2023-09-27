
const database = require("../database/db");



const fetching=async(req,res)=>{
    const c_id=req.body.c_id
  
    const query=`select createorder.product_name,createorder.quantity,products.alternate_name ,products.product_description from products join createorder  on createorder.product_id=products.product_id where createorder.c_id=?` 
    database.query(query,[c_id],(err,result)=>{
        if(err)console.error(err)
        if(!result[0]){
            return res.send("no customer")
        }else
         return res.send(result)
    })
}

module.exports={
    fetching
}
