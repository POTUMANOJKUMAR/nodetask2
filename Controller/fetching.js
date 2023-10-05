const database = require("../database/db");

const fetching = async (req, res) => {
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

module.exports = {
    fetching
};
