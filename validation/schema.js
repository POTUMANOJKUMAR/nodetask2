const Joi = require("@hapi/joi");

const products = Joi.object({
    product_id: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(0).required(),
  });
  
 
  const schema = Joi.object({
    
    cust_id: Joi.number().integer().min(1).required(),
    products: Joi.array().items(products).min(1).required(),
  });
  const schema1=Joi.object({
    orderId:Joi.number().integer().min(1).required(),
    items: Joi.array().items(products).min(1).required(),
  })

module.exports={schema,schema1}