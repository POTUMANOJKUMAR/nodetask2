const { schema1 } = require("../validation/schema");

const updatesValidation = (req, res, next) => {
  const { error } = schema1.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports = updatesValidation;
