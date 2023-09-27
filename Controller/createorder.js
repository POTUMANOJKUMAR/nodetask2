const database = require("../database/db");

const createorder = async (req, res) => {
    const c_id = req.body.c_id;
    const query = `SELECT name FROM customers WHERE c_id = ?;`;
    database.query(query, [c_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "server error", });
        }
        if (result.length === 0) {
            return res.status(404).send("Customer not found");
        }

        const products = req.body.products;
        const productIds = products.map((product) => product.product_id);
        const quantities = products.map((product) => product.quantity);
        const query1 = `SELECT product_id, product_name, quantity FROM products WHERE product_id IN (${productIds.join(',')})`;

        database.query(query1, [productIds], (err, productResults) => {
          
            if (err) {
                console.error(err);
                return res.status(500).send({ message: "Server error", err });
            }

            const lessQuantity = productResults.filter((item, index) => item.quantity < quantities[index]);
         console.log(lessQuantity)  
          if (lessQuantity.length > 0) {
                return res.status(400).send({ message: "Insufficient quantity for some products", products: lessQuantity });
            }

            const query2 = `INSERT INTO CREATEORDER(c_id, product_id, product_name, quantity) VALUES ?`;
            const values = productResults.map((item, index) => [c_id, productIds[index], item.product_name, quantities[index]]);
            database.query(query2, [values], (err, insertResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: "Server error", err });
                }

               
                const update = productResults.map((item, index) => ({
                    quantity: quantities[index],
                    product_id: item.product_id,
                }));

               
                const updateQuery = `UPDATE products AS p
                SET p.quantity = p.quantity - ?
                WHERE p.product_id = ?`;


                const updateValuesArray = update.reduce((acc, val) => {
                    acc.push(val.quantity);
                    acc.push(val.product_id);
                    return acc;
                }, []);
                

                database.query(updateQuery, updateValuesArray, (err, updateResult) => {console.log(updateResult)
                    if (err) {
                        console.error(err);
                        return res.status(500).send({ message: "Server error", err });
                    }

                    res.send({ message: "Order created successfully, products table updated" });
                });
            });
        });
    });
};

module.exports = { createorder };
