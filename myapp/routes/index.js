var express = require('express');
var router = express.Router();
var { createUser, userLogin, resetPassword } = require("../api/users/controllers/user.controller");
var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
  let status = 0;
  if(!req.session.userdata) {
    status = 1;
  }
  res.render('index', { title: 'Express', layout: false, status: status });
});

router.get('/login', function(req, res, next) {
  if(typeof req.session.userdata !== 'undefined') {
    res.redirect('/');
  }
  res.render('login', { title: 'Express', layout: false });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
   });
});

router.get('/forgotpassword', function(req, res, next) {
  if(typeof req.session.userdata === 'undefined') {
    res.redirect('/login');
  }
  res.render('forgotpassword', { title: 'Express', layout: false });
});

router.get('/setpassword', function(req, res, next) {
  if(typeof req.session.userdata === 'undefined') {
    res.redirect('/login');
  }
  res.render('setpassword', { title: 'Express', layout: false });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express', layout: false });
});

router.post('/login', userLogin);

router.post('/signup', createUser);

router.post('/resetPassword', resetPassword);

router.get('/dashboard', function(req, res, next) {
	if(typeof req.session.userdata === 'undefined') {
    res.redirect('/login');
  }
	res.render('dashboard', { title: 'dashboard', layout: 'user/layout', pagename: 'dashboard', sessFirstName: req.session.userdata.first_name, sessLastName: req.session.userdata.last_name });	
});

router.get('/order', function(req, res, next) {
  if(typeof req.session.userdata === 'undefined') {
    res.redirect('/login');
  }
  res.render('order', { title: 'dashboard', layout: 'user/layout', pagename: 'dashboard', sessFirstName: req.session.userdata.first_name, sessLastName: req.session.userdata.last_name });  
});

router.get('/createorder', function(req, res, next) {
  if(typeof req.session.userdata === 'undefined') {
    res.redirect('/login');
  }
  res.render('createorder', { title: 'Createorder', layout: 'user/layout', pagename: 'createorder', sessFirstName: req.session.userdata.first_name, sessLastName: req.session.userdata.last_name }); 
});


module.exports = router;
