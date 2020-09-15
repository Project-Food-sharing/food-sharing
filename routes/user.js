const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

router.get("/login", (req, res, next) => {
  res.render("user/login");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  console.log;
  if (password.length < 8) {
    //using render instead of redirect because we are passing an messag with it
    res.render("user/signup", {
      message: "Your password needs to be 8 chars min",
    });
    return;
  }
  if (username === "") {
    res.render("user/signup", { message: "Your username cannot be empty" });
    return;
  }
  User.findOne({ username: username })
    .then((found) => {
      if (found !== null) {
        res.render("user/signup", {
          message: "This username is already taken",
        });
      } else {
        //hash the password, create the user and redirect to profile page
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        User.create({
          username: username,
          password: hash,
        }).then((dbUser) => {
          res.redirect("/login");
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then((found) => {
      if (found === null) {
        res.render("user/login", { message: "Invalid credentails" });
        return;
      }
      if (bcrypt.compareSync(password, found.password)) {
        req.session.user = found;
        res.redirect("/dashboard");
      } else {
        res.render("user/login", { message: "Invalid credentails" });
      }
    })
    .catch((error) => {
      next(error);
    });
});

//update this once the dashboard page is ready with id
router.get("/profile", (req, res, next) => {
  User.findById(req.session.user._id)
    .populate("food")
    .then((user) => {
      console.log("profile page", user);
      res.render("user/profile", { user: user });
    });
});

router.get("/profile/:id/edit", (req, res, next) => {
  console.log("params", req.params);
  const id = req.params.id;
  res.render("user/edit", { id: id });
});

router.post("/profile/:id/edit", (req, res, next) => {
  console.log("edit profile", req.body);
  const { zipcode, houseNumber, street } = req.body;
  User.findByIdAndUpdate(req.params.id, {
    zipcode,
    houseNumber,
    street,
  })
    .then((found) => {
      console.log("here");
      res.redirect("/profile");
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.redirect("/");
    }
  });
});

// router.get("/status", (req, res, next) => {
//   const userStatus = document.getElementById("user-status");

//   if (user.food.status === "Blocked") {
//     userStatus.addEventListener("onclick", () => {
//       document.getElementById("user-status").innerText = "Gone";
//     });
//   }
//   res.render("user/profile");
// });

module.exports = router;