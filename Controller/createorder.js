const database = require("../database/db");

const createorder = async (req, res) => {
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

module.exports = { createorder };
