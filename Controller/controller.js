const database = require("../database/db");
const postproduct = async (req, res) => {
  const {
    product_id,
    product_name,
    alternate_name,
    product_description,
    price,
    product_image,
    quantity
  } = req.body;
  const insert = "INSERT INTO PRODUCTS(product_id,product_name,alternate_name,product_description,price,product_image,quantity) values(?,?,?,?,?,?,?)";
  database.query(insert, [product_id,
    product_name,
    alternate_name,
    product_description,
    price,
    product_image,
    quantity,
  ],(err,result)=>{
    if(err) console.log(err)
    res.send("posted!")
  });
}
module.exports = {postproduct};

