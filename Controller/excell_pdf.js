const database = require("../database/db");
const XLSX = require("xlsx");
//invoice pdf    (1 API)
//json to excell (2 API)
//json to excell (3 API)
const sendmail=require("../nodemailer/mail")
const mimeDb = require("mime-db");
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
class mainFunction1{
  async excell(req, res) {
    try {
      const query = `SELECT
          c.customer_name,
          Co.prod_id,
          p.product_name,
          p.product_alternate_name,
          p.product_description,
          p.product_price,
          Co.prod_quantity
          FROM
          customers AS c
      JOIN
      createorder AS Co ON c.customer_id = Co.cust_id
      JOIN
      productinfo AS p ON Co.prod_id = p.product_id
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
  async invoice(req, res) {
    try {
        const { ord_id, cust_id } = req.body;
        const sql = `
            SELECT co.ord_id, c.customer_name, SUM(p.product_price * co.prod_quantity) as grand_total
            FROM createorder co 
            JOIN productinfo p ON p.product_id = co.prod_id
            JOIN customers c ON c.customer_id = co.cust_id 
            WHERE co.ord_id = ? AND co.cust_id = ?
        `;
        const [grandTotal] = await database.query(sql, [ord_id, cust_id]);

        console.log(grandTotal);

        const itemsHtml = grandTotal.map(item => `
        <li>
        <div>order_id:${item.ord_id}</div>
        <div>customer_name: ${item.customer_name}</div>
        <div>GrandTotal: ${item.grand_total}</div>
        </li>
    `).join('');
    console.log(itemsHtml)

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>h1 { color: red; }</style>
        </head>
        <body>
            <h1>Invoice</h1>
            <ul>
                ${itemsHtml}
            </ul>
          
        </body>
        <style>

        h1{
            text-align:center;
            color:black;
            font-size:40px;
            background-color:gray;
        }
       li {
          
            display: flex;
            flex-direction: column;
       
            color:black;
            font-size:30px;
          
        }
        </style>
        </html>
    `;
        const pdfOptions = { format: 'Letter' };

       
        const pdfFilePath = path.join(__dirname, 'invoices', 'invoice.pdf');

        pdf.create(html, pdfOptions).toFile(pdfFilePath, (err, response) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to create PDF' });
            } else {
                console.log(response);
                res.status(200).json({ message: 'PDF created successfully' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
 async multer(req, res){
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    try {
      let path = `../TASK2NODEJS/upload/${req.file.filename}`
      const workbook = XLSX.readFile(path);
      const sheetName = workbook.SheetNames[0]; 
  
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
     
     
      res.json(data);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      res.status(500).send('Error parsing Excel file');
    }
  };
  



}

module.exports = new mainFunction1
