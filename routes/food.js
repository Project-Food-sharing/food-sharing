const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const app = require("../app");
// const { uploader, cloudinary } = require("../config/cloudinary.js");

// RENDERING VIEWS

router.get("/add", (req, res) => {
  let categories = ["Raw", "Prepared", "Drinks"];
  res.render("add", { categories });
});

// LIST ALL FOOD ENTRIES

router.get("/dashboard", (req, res, next) => {
  Food.find()
    .then((allFoodDB) => {
      console.log(allFoodDB);
      res.render("dashboard", { allFoodDB: allFoodDB });
    })
    .catch((error) => {
      next(error);
    });
});

// DETAIL VIEW

router.get("/details/:id", (req, res, next) => {
  const id = req.params.id;

  Food.findById(id).then((foodFromDB) => {
    res.render("details", { newFood: foodFromDB });
  });
});

// ADD NEW

router.post("/dashboard", (req, res, next) => {
  // Add creator to the constructor after merging with Khushboo
  const {
    title,
    description,
    categories,
    status,
    creator,
    latitud,
    longitud,
    // imgName,
    // imgPath,
    // imgPublicId,
    date,
  } = req.body;

  Food.create({
    title,
    description,
    categories,
    creator,
    latitud,
    longitud,
    // imgName,
    // imgPath,
    // imgPublicId,
    date,
  })
    .then((newFood) => {
      console.log(`A new entry was added to the list ${newFood}`);
      res.redirect(`/details/${newFood.id}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
