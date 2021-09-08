//var { submitOrder } = require("../services/order.service");
const { body, validationResult } = require('express-validator/check');

function createOrder(req, res, next){
	let status = 0;
    if(!req.session.userdata) {
   		status = 1;
  	}
    res.render('createorder', { title: 'Express', layout: false, status: status, data:{}, errors:{} });
}

function validate(method){
	switch (method) {
		case 'submitOrder': {
			return[
				body('channel', 'Channel doesnt exists').exists().isEmail(),
				body('corder', 'Corder doesnt exists').exists().isEmail(),
				body('date', 'Date Invalid doesnt exists').exists().isEmail(),
				body('product', 'Invalid doesnt exists').exists().isEmail(),
				body('payment', 'Payment doesnt exists').exists().isEmail(),
				body('method', 'Method doesnt exists').exists().isEmail(),
				body('customer', 'Customer doesnt exists').exists().isEmail(),
				body('zipcode', 'Zipcode doesnt exists').exists().isEmail(),
				body('weight', 'Weight doesnt exists').exists().isEmail(),
				body('ivr_status', 'IVR Status doesnt exists').exists().isEmail(),
				body('tags', 'Tags doesnt exists').exists().isEmail(),
				body('status', 'Status doesnt exists').exists().isEmail()
			]
		}
		case 'updateOrder': {
			return[
				body('channel', 'Channel doesnt exists').exists().isEmail(),
				body('corder', 'Corder doesnt exists').exists().isEmail(),
				body('date', 'Date Invalid doesnt exists').exists().isEmail(),
				body('product', 'Invalid doesnt exists').exists().isEmail(),
				body('payment', 'Payment doesnt exists').exists().isEmail(),
				body('method', 'Method doesnt exists').exists().isEmail(),
				body('customer', 'Customer doesnt exists').exists().isEmail(),
				body('zipcode', 'Zipcode doesnt exists').exists().isEmail(),
				body('weight', 'Weight doesnt exists').exists().isEmail(),
				body('ivr_status', 'IVR Status doesnt exists').exists().isEmail(),
				body('tags', 'Tags doesnt exists').exists().isEmail(),
				body('status', 'Status doesnt exists').exists().isEmail()
			]
		}
	}
}

function submitOrder(req, res, next){
	//console.log('submitorder');
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
	        res.status(422).json({ errors: errors.array() });
	        return;
	    }

	    var body = req.body;
	    submitOrder(body, (err, results) => {
	    	if (err) {
	            return res.status(500).json({
	                success: 0,
	                message: "Database connection error"
	            });
	        }
	        res.redirect('/order/create');
	    });
	    
	} catch(err) {
    	return next(err)
    }
	/*res.render('createorder', {
		data: req.body,
		error: {
			first_name: {msg: 'First name is required'},
			last_name: {msg: 'Last name is required'},
			company_name: {msg: 'Company name is required'},
			address: {msg: 'Address is required'},
			pin_code: {msg: 'Pin code is required'},
			city: {msg: 'City is required'},
			state: {msg: 'State is required'},
			phone: {msg: 'Phone is required'},
			bfirst_name: {msg: 'First name is required'},
			blast_name: {msg: 'Last name is required'},
			bcompany_name: {msg: 'Company name is required'},
			baddress: {msg: 'Address is required'},
			bpin_code: {msg: 'Pin code is required'},
			bcity: {msg: 'City is required'},
			bstate: {msg: 'State is required'},
			bphone: {msg: 'Phone number is required'},
			gst_number: {msg: 'Gst number is required'},
			weight: {msg: 'Weight is required'},
			dimension: {msg: 'Dimension is required'},
			shipping_charges: {msg: 'Shipping charges is required'},
			cod_charges: {msg: 'COD charges is required'},
			discount: {msg: 'Discount is required'}
		}
	});*/
}

function editOrder(req, res, next){
	try {
	    let status = 0;
	    if(!req.session.userdata) {
	   		status = 1;
	  	}

	  	const errors = validationResult(req);
		if (!errors.isEmpty()) {
	        res.status(422).json({ errors: errors.array() });
	        return;
	    }

	    var body = req.body.id;
	    getOrder(body, (err, results) => {
    		if (err) {
	            return res.status(500).json({
	                success: 0,
	                message: "Database connection error"
	            });
	        }
	    	res.render('editOrder', { title: 'Express', layout: false, status: status, results: results, data:{}, errors:{} });
	    });
	} catch(err) {
		return next(err)
	}
}

function updateOrder(req, res, next){
	try {
		let status = 0;
	    if(!req.session.userdata) {
	   		status = 1;
	  	}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
	        res.status(422).json({ errors: errors.array() });
	        return;
	    }

	    updateOrder(body, (err, results) => {
	    	if (err) {
	            return res.status(500).json({
	                success: 0,
	                message: "Database connection error"
	            });
	        }
	        res.redirect('/order/view');
	    });

	} catch(err) {
		return next(err)
	}
}

function allOrder(req, res, next){
	let status = 0;
    if(!req.session.userdata) {
   		status = 1;
  	}

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    allOrder()
}

module.exports = { createOrder, submitOrder, validate, editOrder, updateOrder, allOrder }