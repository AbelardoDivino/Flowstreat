function validate(schema) {
  return (req, res, next) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      next();
    } catch (e) {
      const message = e.errors ? e.errors.map((x) => x.message).join(', ') : e.message;
      return res.status(400).json({ error: message });
    }
  };
}

module.exports = validate;
