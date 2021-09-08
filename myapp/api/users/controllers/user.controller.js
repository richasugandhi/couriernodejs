var { create, login, checkEmail } = require("../services/user.service");
const bcrypt = require('bcrypt');
const saltRounds = 10;

function createUser(req, res, next) {
	var body = req.body;
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(body.password, salt);

	body.role = body.role.toString();
	body.password = hash;

	create(body, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        res.redirect('/login');
    });
}

function userLogin(req, res, next) {
	const body = JSON.parse(JSON.stringify(req.body));
	const sessionval = req.session;
	login(body, (err, results) => {
		if (err) {
			return res.status(500).json({
				success: 0,
				message: "Database connection error"
			});
		}
		
		const resultObj = Object.values(JSON.parse(JSON.stringify(results)));
		var user = resultObj[0];
		var hashPwd = user.password.toString(0);
		var bPwdString = body.password.toString();

		bcrypt.compare(bPwdString, hashPwd, function(err, isMatch) {
			if (err) {
				console.log('ifif');
			    throw err
			} else if (!isMatch) {
				console.log('elseifififi');
			    res.render('login', {
		            message: 'Invalid username or password',
		            messageClass: 'alert-danger',
		            layout: false
		        });
			} else {
				console.log('elsleslesle');
				/*req.session.regenerate(function(err) {
					userdata:user
				})*/
				sessionval.userdata = user;
			    res.redirect('/dashboard');
			}
		});
	});
}

function resetPassword(req, res, next) {
	const body = JSON.parse(JSON.stringify(req.body));
	checkEmail(body, (err, results, req) => {
		if (err) {
			console.log('err');
			/*res.render('forgotpassword', {
	            message: 'Database connection error',
	            messageClass: 'alert-danger'
	        });*/
	        res.redirect('/forgotpassword');
		}

		if(results.length > 0) {
			const resultObj = Object.values(JSON.parse(JSON.stringify(results)));
			var user = resultObj[0];
			if(user.id != '') {
				res.redirect('/setpassword');
			} else {
				console.log('else');
				/*res.render('forgotpassword', {
		            message: 'Emailid not found !!',
		            messageClass: 'alert-danger'
		        });*/
		        res.redirect('/forgotpassword');
			}
		} else {
			console.log('ressarr');
			//req.flash('deletePostErrorMsg', 'Something went wrong while deleting post!');
			res.redirect('/forgotpassword');
			//res.render('/test',{message: 'Emailid not found !!'});
		}
			
	});
}

module.exports = { createUser, userLogin, resetPassword }