const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const app = require("../app");
const User = require("../models/User");
const { loginCheck } = require("../routes/middlewares.js");
const { findById } = require("../models/Food");
// const { uploader, cloudinary } = require("../config/cloudinary.js");

// RENDERING VIEWS

router.get("/add", (req, res) => {
  let categories = ["Raw", "Prepared", "Drinks"];
  console.log("add in food", req.session.user);
  req.session.user.role = "creator";
  res.render("food/add", { categories });
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
    res.render("food/details", { newFood: foodFromDB });
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
    latitud,
    longitud,
    date,
  } = req.body;

  // const imgName = req.file.originalname;
  // const imgPath = req.file.url;
  // const imgPublicId = req.file.public_id;

  Food.create({
    title,
    description,
    categories,
    status,
    creator: req.session.user._id,
    latitud,
    longitud,
    // imgName,
    // imgPath,
    // imgPublicId,
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
    .catch((error) => {
      console.log(error);
    });
});

// EDIT FOOD ENTRY

router.get("/food/:id/edit", loginCheck(), (req, res, next) => {
  // console.log(req.session.user);

  const { zipcode, houseNumber, street } = req.session.user;
  Food.findById(req.params.id)
    .populate("creator")
    .then((foodData) => {
      console.log("food creator", typeof foodData.creator._id);
      console.log("user id", typeof req.session.user._id);

      Food.findByIdAndUpdate(req.params.id, { zipcode, houseNumber, street })
        .then((foodToEdit) => {
          // console.log(foodToEdit);
          // console.log("user session id", req.session.user._id);
          //console.log("user session creator", req.session.user);
          if (req.session.user._id == foodData.creator._id) {
            res.render("food/edit", { foodToEdit: foodToEdit });
          } else {
            console.log("another username");
          }
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((err) => console.log(err));
});

// /gone/{{_id}}

router.post("/gone/:foodId", (req, res, next) => {
  Food.findByIdAndUpdate(
    req.params.foodId,
    { status: "Gone" },
    { new: true }
  ).then((editedFood) => {
    res.send(editedFood.status);
  });
});

// /blocked/{{_id}}

router.post("/blocked/:foodId", (req, res, next) => {
  Food.findByIdAndUpdate(
    req.params.foodId,
    { status: "Blocked" },
    { new: true }
  ).then((editedFood) => {
    res.send(editedFood.status);
  });
});

module.exports = router;