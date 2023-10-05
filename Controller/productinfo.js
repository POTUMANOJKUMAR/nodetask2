const database = require('../database/db');

const postproduct = async (req, res) => {
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

module.exports = { postproduct };
