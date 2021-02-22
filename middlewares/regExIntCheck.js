module.exports = (regex, message) =>
  function (req, res, next) {
    if (regex.test(req.params.uuid)) {
      next();
    } else {
      res.status(404).json({
        status: "error",
        message: message || "Wrong format uuid",
      });
    }
  };
