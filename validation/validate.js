const user = require('./schema');

const ValidationMiddleware = async (req, res, next) => {
  const value = user.validate(req.body);
  console.log(value);
  if (value.error) {
    res.status(400).json({ message: value.error.details[0].message }); // Corrected status code to 400
  } else {
    next();
  }
};

module.exports = ValidationMiddleware;
