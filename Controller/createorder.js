const database = require("../database/db");
//post the products(1 API)
//post the customers(2 API)
// create the order(3 API)
//update the order(4 API)
//fetching order detailes(5 API)
class mainFunction{
 async postproduct(req, res)  {
    try {
      const {
        product_name,
        alternate_name,
        product_description,
        price,
        product_image,
        quantity,
      } = req.body;
  
      const insertQuery =
        'INSERT INTO PRODUCTinfo(product_name, product_alternate_name, product_description, product_price, product_image, product_quantity) VALUES (?, ?, ?, ?, ?, ?)';
  
      await database.query(insertQuery, [
        product_name,
        alternate_name,
        product_description,
        price,
        product_image,
        quantity,
      ]);
  
      res.send('posted!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  };
  async createorder(req, res) {
    const { cust_id, products } = req.body;
  
    try {
    
      const [customerResult] = await database.query('SELECT customer_name FROM customers WHERE customer_id = ?', [cust_id]);
  
      if (customerResult.length === 0) {
        return res.status(404).send("Customer not found");
      }
  
      const productIds = products.map((product) => product.product_id);
      const quantities = products.reduce((map, product) => {
        map[product.product_id] = product.quantity;
        return map;
      }, {});
  
     
      const [productResults] = await database.query('SELECT product_id, product_name, product_quantity FROM productinfo WHERE product_id IN (?)', [productIds]);
  
      if (productResults.length !== productIds.length) {
        return res.status(400).send({ message: "Some products not found in the database" });
      }
  
      const lessQuantity = productResults.filter((item) => item.product_quantity < quantities[item.product_id]);
  
      if (lessQuantity.length > 0) {
        return res.status(400).send({ message: "Insufficient quantity for some products", products: lessQuantity });
      }
  
    
      const [orderResult] = await database.query('INSERT INTO orderinfo (cust_id) VALUES (?)', [cust_id]);
      const order_id = orderResult.insertId;
  
      const values = productResults.map((item) => [order_id, cust_id, item.product_id, quantities[item.product_id]]);
  
      
      await database.query('INSERT INTO createorder (ord_id, cust_id, prod_id, prod_quantity) VALUES ?', [values]);
  
     
      const updateQuery = `UPDATE productinfo SET product_quantity = CASE ${productResults.map((item) => `WHEN ${item.product_id} THEN product_quantity - ${quantities[item.product_id]}`).join(' ')} END WHERE product_id IN (${productIds.join(',')})`;
  
      await database.query(updateQuery);
      
  
      res.send({ message: "Order created successfully, products table updated" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Server error", err });
    }
  };



async  customers(req,res){
  try{ 
      const {name}=req.body;
  const [insert]=await database.query(`insert into customers (customer_name) values(?)`,[name])
 res.send("customer joined")
 
}
catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}}


async fetching(req, res)  {
  try {
      const c_id = req.body.c_id;

      const [results] = await database.query(
          `SELECT  createorder.prod_quantity, productinfo.product_alternate_name, productinfo.product_description
          FROM createorder
          JOIN productinfo ON createorder.prod_id = productinfo.product_id
          WHERE createorder.cust_id = ?`,
          [c_id]
      );

      res.json(results);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};
async update(req, res) {
  const { orderId, items } = req.body;

  try {
    
      const [orderinfo] = await database.query('SELECT orderinfo_id FROM orderinfo WHERE orderinfo_id = ?', [orderId]);

      if (!orderinfo.length) {
          return res.status(400).send('Invalid Order Id');
      }

     
      const allproducts = await database.query('SELECT * FROM productinfo');
      const allproductsquantity = allproducts[0];

     
      const originalproducts = await database.query('SELECT * FROM createorder WHERE ord_id=?', [orderId]);
      const customerid = await database.query('SELECT cust_id FROM orderinfo WHERE orderinfo_id =?', [orderId]);
      const customerId = customerid[0][0].cust_id;

     
      const updatequantity = [];
      const updatequantityinproductinfo = [];
      const newproduct = [];
      const productsToRemove = [];
      const addquantityinproductinfo = [];


      
      for (const product of items) {
          const productId = product.product_id;
          const productQuantity = product.quantity;

         
          const checkingproduct = allproductsquantity.find((obj) => obj.product_id === productId);

          if (!checkingproduct) {
              return res.status(500).send(`The given product id ${productId} does not exist`);
          }

          if (checkingproduct.product_quantity - productQuantity <= 0) {
              if (checkingproduct.product_quantity == 0) {
                  return res.status(500).send(`The quantity of the given product id ${productId} is nil`);
              } else {
                  return res.status(500).send(`Please choose a lesser quantity than ${checkingproduct.product_quantity} for product_id: ${productId}.`);
              }
          }

         
          const checkingproduct1 = originalproducts[0].find((products) => products.prod_id === productId);

          if (checkingproduct1) {
             
              updatequantity.push([productQuantity, productId]);
              const finalquantity = productQuantity - checkingproduct1.prod_quantity;
              updatequantityinproductinfo.push([finalquantity, productId]);
             
          } else {
            
              newproduct.push([orderId, customerId, productId, productQuantity]);
              updatequantityinproductinfo.push([productQuantity, productId]);
             
          }
      }

     
      for (const products of originalproducts[0]) {
          const checkingproduct = items.find((updateProd) => updateProd.product_id === products.prod_id);

          if (!checkingproduct) {
          
              addquantityinproductinfo.push([products.prod_quantity,products.prod_id]);
              productsToRemove.push(products.prod_id);
          }
      }

    

     
      if (updatequantity.length !== 0) {
          let sql = 'UPDATE createorder SET prod_quantity = CASE prod_id ';
          updatequantity.forEach((item) => {
              sql += `WHEN ${item[1]} THEN ${item[0]} `;
          });
          sql += 'END WHERE prod_id IN (';
          updatequantity.forEach((item, index) => {
              sql += `${item[1]}${index < updatequantity.length - 1 ? ',' : ''}`;
          });
          sql += ')';

          await database.query(sql);
      }

      
      if (updatequantityinproductinfo.length !== 0) {
          let sql = 'UPDATE productinfo SET product_quantity = CASE product_id ';
          updatequantityinproductinfo.forEach((item) => {
              sql += `WHEN ${item[1]} THEN product_quantity - ${item[0]} `;
          });
          sql += 'END WHERE product_id IN (';
          updatequantityinproductinfo.forEach((item, index) => {
              sql += `${item[1]}${index < updatequantityinproductinfo.length - 1 ? ',' : ''}`;
          });
          sql += ')';

          await database.query(sql);
      }

    
      if (newproduct.length !== 0) {
          await database.query('INSERT INTO createorder(ord_id, cust_id, prod_id, prod_quantity) VALUES ?', [newproduct]);
      }
      if(addquantityinproductinfo.length !== 0)
      {  
        let sql =`update productinfo set product_quantity = case product_id `;
        addquantityinproductinfo.forEach(item => {
          sql+= `when ${item[1]} then product_quantity + ${item[0]} `;
        });
        sql+= `end where product_id in (`;
        addquantityinproductinfo.forEach((item,index)=>{
         sql+= `${item[1]}${index < addquantityinproductinfo.length -1 ? ',' : ''}`;
        });
        sql+=`)`;    
       await database.query(sql);
      }

     
      if (productsToRemove.length !== 0) {
          let sql = 'DELETE FROM createorder WHERE (ord_id, prod_id) IN (';
          productsToRemove.forEach((productIdToRemove, index) => {
              sql += `(${orderId}, ${productIdToRemove})${index < productsToRemove.length - 1 ? ',' : ''} `;
          });
          sql += ')';

          await database.query(sql);
      }

      res.status(200).send('Order Updated');
  } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
  }
};








}



module.exports = new mainFunction ;
