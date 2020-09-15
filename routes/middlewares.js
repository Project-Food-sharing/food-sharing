// MIDDLEWARE CONFIG

const loginCheck = () => {
  return (req, res, next) => {
    // if the user is logged in, proceed with the next step
    if (req.session.user) {
      next();
    } else {
      // else redirect to login
      res.redirect("/login");
    }
  };
};

module.exports = {
  loginCheck: loginCheck,
};
