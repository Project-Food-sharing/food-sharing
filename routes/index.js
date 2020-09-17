const express = require("express");
const router = express.Router();
const Food = require("../models/Food")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/rawdata", (req, res, next)=>{
   Food.find()
   .then(document => {
     res.json(document)
   }) 
})

module.exports = router;
