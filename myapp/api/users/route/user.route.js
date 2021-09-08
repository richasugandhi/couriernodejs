var { createUser, userLogin, resetPassword } = require("../controllers/user.controller");
var router = require("express").Router();

router.post('/login', userLogin);

router.post('/register', createUser);

router.post('/resetPassword', resetPassword);

/*router.get('/register', function(req, res) {
	console.log('aa');
	console.log(req.body);
	res.send('respond with a resource');
});*/

module.exports = router;