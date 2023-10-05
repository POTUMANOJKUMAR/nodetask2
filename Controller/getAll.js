const database = require("../database/db");
const XLSX = require("xlsx");

const sendmail=require("../nodemailer/mail")
const mimeDb = require("mime-db");
const getAll = async (req, res) => {
  try {
    const query = `SELECT
        c.customer_name,
        o.prod_id,
        p.product_name,
        p.product_alternate_name,
        p.product_description,
        p.product_price,
        o.prod_quantity
        FROM
        customers AS c
    JOIN
    createorder AS o ON c.customer_id = o.cust_id
    JOIN
    productinfo AS p ON o.prod_id = p.product_id
     `;

    const [getall] = await database.query(query);
   
   
    const columnHeaders =  Object.keys(getall[0]);
    
    const columnData=getall.map((obj) => Object.values(obj))
    
    const arrayOfArrays = [columnHeaders,...columnData];
    
    const ws = XLSX.utils.aoa_to_sheet(arrayOfArrays);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    const outputPath = "output.xlsx";

    await XLSX.writeFile(wb, outputPath);
  

    sendmail()
    return res.send("email sent successfully")


    

   
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
module.exports = { getAll };
