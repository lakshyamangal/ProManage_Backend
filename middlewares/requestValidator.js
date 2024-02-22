const { validationResult } = require("express-validator");
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = [];
    errors.array().forEach((err) => {
      messages.push(err.msg);
    });
    return res.send({ success: false, data: [messages.toString()] });
  }
  next();
};
module.exports = { validateRequest };
