var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login', { message: req.flash('loginMessage')});
});

router.get('/signup', function(req, res) {
  res.render('signup', { message: req.flash('signupMessage')});
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', { user: req.user});
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  //console.log(req.isAuthenticated());
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
