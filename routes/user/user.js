const express = require('express');
const router  = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt')

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login',(req,res,next) =>{
  res.render('login')
})

router.post('/signup',(req, res, next) => {
  const {username, password} = req.body
  console.log
  if(password.length<8){
    //using render instead of redirect because we are passing an messag with it
    res.render('signup',{message:'Your password needs to be 8 chars min'})
    return;
  }
  if(username === ''){
    res.render('signup',{message:'Your username cannot be empty'})
    return;
  }
  User.findOne({ username: username})
  .then(found => {
    if(found !== null){
      res.render('signup',{message:'This username is already taken'})
    }else{
     //hash the password, create the user and redirect to profile page
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt)
    User.create({
      username: username,
      password: hash
    })
    .then(dbUser => {
      res.redirect('/login')
    })
    }
  }).catch(error => {
    next(error)
  })
});

router.post('/login',(req, res, next) => {
  const {username, password} = req.body;
  User.findOne({username: username})
  .then(found => {
    if (found === null){
      res.render('login',{message:'Invalid credentails'})
      return;
    }
    if(bcrypt.compareSync(password, found.password)){
    req.session.user = found;
    res.redirect('/profile')
    } else {
      res.render('login',{message:'Invalid credentails'})
    }
  })
  .catch(error => {
    next(error)
  })
});


//update this once the dashboard page is ready with id
router.get('/profile', (req, res, next) => {

 console.log("profile page", req.session.user)
 res.render('profile', {user: req.session.user})
})

router.get('/profile/:id/edit', (req, res, next) => {
  console.log("params",req.params)
  const id = req.params.id
  res.render('edit', { id : id})
})

router.post('/profile/:id/edit', (req, res, next) => {
  console.log("edit profile", req.body)
  const {zipcode, houseNumber, street} = req.body
  User.findByIdAndUpdate(req.params.id,{
    zipcode,
    houseNumber,
    street
  })
  .then(found => {
    console.log("here")
    res.redirect('/profile')
  })
  .catch(error => {
    next(error)
  })
})





module.exports = router