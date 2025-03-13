const validateFormValues = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    console.log(err);
    let errorResponse = {
      data: {},
      message: err.errors ? err.errors[0] : err.message,
      status: 0,
    };

    return res.status(400).json(errorResponse);
  }
};

module.exports = {
  validateFormValues,
};
