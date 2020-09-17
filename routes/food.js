const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const app = require("../app");
const User = require("../models/User");
const { loginCheck } = require("../routes/middlewares.js");
const { findById } = require("../models/Food");
const { uploader, cloudinary } = require("../config/cloudinary.js");

// RENDERING VIEWS

router.get("/add", (req, res) => {
  let categories = ["Raw", "Prepared", "Drinks"];
  // console.log("add in food", req.session.user);
  res.render("food/add", { categories, user: req.session.user });
});

// LIST ALL FOOD ENTRIES

router.get("/dashboard", (req, res, next) => {
  Food.find()
    .populate("creator")
    .then((allFoodDB) => {
      const filteredFood = allFoodDB.map(function (data) {
        if (data.status === "Available" || data.status === "Blocked")
          return data;
      });
      // console.log("dashboard",filteredFood);
      res.render("dashboard", { allFoodDB: filteredFood });
    })
    .catch((error) => {
      next(error);
    });
});

// DETAIL VIEW

router.get("/details/:id", loginCheck(), (req, res, next) => {
  console.log("req", req.session.user);
  const id = req.params.id;

  Food.findById(req.params.id)
    .then((foodFromDB) => {
      if (req.session.user._id == foodFromDB.creator._id.toString()) {
        //  console.log("this is true")
        foodFromDB.creator.role = true;
      }
      //option logic
      res.render("food/details", { newFood: foodFromDB });
    })
    .catch((err) => {
      next(err);
    });
});

// ADD NEW

router.post("/dashboard", uploader.single("photo"), (req, res, next) => {
  // Add creator to the constructor after merging with Khushboo
  const {
    title,
    description,
    categories,
    status,
    latitud,
    longitud,
    date,
  } = req.body;

  // console.log("this is req.file", req.file);
  const imgName = req.file.originalname;
  const imgPath = req.file.url;
  const imgPublicId = req.file.public_id;

  Food.create({
    title,
    description,
    categories,
    status,
    creator: req.session.user._id,
    latitud,
    longitud,
    imgName,
    imgPath,
    imgPublicId,
    date,
  })
    .then((newFood) => {
      User.findByIdAndUpdate(req.session.user._id, {
        $push: { food: newFood._id },
      }).then((user) => {
        // console.log(`A new entry was added to the list ${newFood}`);
        res.redirect(`/details/${newFood.id}`);
      });
    })
    .catch((err) => {
      next(err);
    });
});

// EDIT FOOD ENTRY

router.get("/food/:id/edit", loginCheck(), (req, res, next) => {
  Food.findById(req.params.id)
    .then((foodData) => {
      // console.log("this is foodData", foodData);

      Food.findById(req.params.id)
        .then((food) => {
          let options = "";
          let allCategories = ["Raw", "Prepared", "Drinks"];

          allCategories.forEach((categorie) => {
            if (food.categories.includes(categorie)) {
              options += `<input type="checkbox" name="categories" id="categories" checked value="${categorie}"><label for="categories">${categorie}</label>`;
            } else {
              options += `<input type="checkbox" name="categories" id="categories"><label for="categories">${categorie}</label>`;
            }
          });
          console.log("this is options", options);
          res.render("food/edit", { foodData, options });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.post("/food/:id/edit", (req, res, next) => {
  const id = req.params.id;
  res.redirect(`/details/${id}`);
});

// /gone/{{_id}}

router.post("/status/:foodId", (req, res, next) => {
  let status = req.body.status;
  let newStatus = "";
  if (status == "Available") {
    newStatus = "Blocked";
  } else if (status == "Blocked") {
    newStatus = "Gone";
  } else {
    newStatus = "Available";
  }
  Food.findByIdAndUpdate(
    req.params.foodId,
    { status: newStatus },
    { new: true }
  ).then((editedFood) => {
    res.send(editedFood.status);
  });
});

module.exports = router;
