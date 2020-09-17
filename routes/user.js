const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Food = require("../models/Food");

router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

router.get("/login", (req, res, next) => {
  console.log("in login");
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
      console.log("number", user.food.length);
      for (let i = 0; i < user.food.length; i++) {
        if (user.food[i].status === "Available")
          user.food[i].statusAnother = "Blocked";
        else if (user.food[i].status === "Blocked")
          user.food[i].statusAnother = "Gone";
      }
      res.render("user/profile", { user: user });
    });
});

router.get("/profile/:id/edit", (req, res, next) => {
  console.log("params", req.params);
  const id = req.params.id;
  res.render("user/edit", { id: id, user: req.session.user });
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

router.post("/search", (req, res, next) => {
  const searchText = req.body.search;
  console.log({ searchText });
  if (!searchText) {
    Food.find().then((allFoodDB) => {
      const filteredFood = allFoodDB.map(function (data) {
        if (data.status === "Available" || data.status === "Blocked")
          return data;
      });
      console.log("allFoods", filteredFood);
      res.render("dashboard", { allFoodDB: filteredFood });
    });
  }

  Food.find({ title: new RegExp(searchText, "gi") }).then(
    async (searchFood) => {
      let filteredFood;
      if (searchFood.length < 1) {
        console.log(searchFood, " allFoodDB");
        await Food.find().then((allFoodDB) => {
          filteredFood = allFoodDB.map(function (data) {
            if (data.status === "Available" || data.status === "Blocked")
              return data;
          });
        });
      } else {
        filteredFood = searchFood.map(function (data) {
          if (data.status === "Available" || data.status === "Blocked")
            return data;
        });
      }
      console.log("searched", filteredFood);
      res.render("dashboard", { allFoodDB: filteredFood });
      console.log({ allFoodDB });
    }
  );
});

module.exports = router;
