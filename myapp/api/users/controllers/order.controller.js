//var { submitOrder } = require("../services/order.service");
const { body, validationResult } = require('express-validator/check');

const { Validator } = require('node-input-validator');
const validation = require('../../helpers/validation');
const { addOrder, checkOrderIdExist, addShippingAddress, addBillingAddress, addOrderProducts, getShippingDetails, getBillingDetails, getOrderProducts, editOrderService, editBillingAddress, editShippingAddress, editOrderProductService, updateOrderStatusService } = require('../services/order.service');

async function createOrder(req, res) {
	let status = 0;
	if (!req.session.userdata) {
		status = 1;
	}

	try {
		let validator = new Validator(req.body, {
			order_id: 'required|maxLength:11',
			order_type: 'required',
			'shipping': 'required|object',
			'shipping.first_name': 'required|maxLength:20',
			'shipping.last_name': 'maxLength:20',
			'shipping.address': 'required',
			'shipping.pincode': 'required|maxLength:15',
			'shipping.city': 'required',
			'shipping.phone': 'required',
			'billing': 'required|object',
			'billing.first_name': 'required|maxLength:20',
			'billing.last_name': 'required|maxLength:20',
			'billing.address': 'required',
			'billing.pincode': 'required|maxLength:15',
			'billing.city': 'required',
			'billing.phone': 'required',
			'billing.gst_number': 'minLength:15',
			'products': 'required|array',
			'products.*.product_name': 'required',
			'products.*.product_quantity': 'required',
			'products.*.product_amount': 'required',
			weight: 'required',
			dimensions: 'required',
			shipping_charge: 'required',
			cod_charge: 'required',
			tax_charge: 'required',
			discount: 'required'
		});

		let matched = await validator.check();

		if (!matched) {
			let errorMessage = validation.parsevalidation(validator.errors);
			return res.status(422).send({ success: 0, message: errorMessage });
		}

		let orderIdExist = await checkOrderIdExist(req.body.order_id);

		if (orderIdExist && orderIdExist.length > 0) {
			return res.status(422).send({
				success: 0,
				message: "Order Id already exist"
			});
		}

		let orderBody = {
			order_id: req.body.order_id,
			order_type: req.body.order_type,
			weight: req.body.weight,
			dimentions: req.body.dimensions, shipping_charge: req.body.shipping_charge,
			cod_charge: req.body.cod_charge,
			tax_charge: req.body.tax_charge,
			discount: req.body.discount
		}

		let order = await addOrder(orderBody);

		if (!order) {
			return res.status(500).send({ success: 0, message: "Something went wrong" });
		}

		let shippingBody = {
			order_id: req.body.order_id,
			first_name: req.body.shipping.first_name,
			last_name: req.body.shipping.last_name,
			company_name: req.body.shipping.company_name || '',
			address: req.body.shipping.address,
			address2: req.body.shipping.address2,
			pincode: req.body.shipping.pincode,
			city: req.body.shipping.city,
			state: req.body.shipping.state,
			phone: req.body.shipping.phone
		};

		await addShippingAddress(shippingBody);

		let billingBody = {
			order_id: req.body.order_id,
			first_name: req.body.billing.first_name,
			last_name: req.body.billing.last_name,
			company_name: req.body.billing.company_name || '',
			address: req.body.billing.address,
			address2: req.body.billing.address2,
			pincode: req.body.billing.pincode,
			city: req.body.billing.city,
			state: req.body.billing.state,
			phone: req.body.billing.phone,
			gst_number: req.body.billing.gst_number | ''
		};

		await addBillingAddress(billingBody);

		for (let product of req.body.products) {
			product.order_id = req.body.order_id;
			addOrderProducts(product);
		}

		return res.status(200).send({ success: 1, message: "Order placed successfully" });

	} catch (error) {
		console.log(error);
		return res.status(500).send({
			success: 0,
			message: "Something went wrong"
		});
	}

	// res.render('createorder', { title: 'Express', layout: false, status: status, data:{}, errors:{} });
}

async function getOrder(req, res) {
	let status = 0;
	if (!req.session.userdata) {
		status = 1;
	}

	try {

		let validator = new Validator(req.params, {
			order_id: 'required|maxLength:11'
		});

		let matched = await validator.check();

		if (!matched) {
			let errorMessage = validation.parsevalidation(validator.errors);
			return res.status(422).send({ success: 0, message: errorMessage });
		}

		let order = await checkOrderIdExist(req.params.order_id);

		if (order && order.length == 0) {
			return res.status(422).send({
				success: 0,
				message: "Order not found"
			});
		}

		let shippingDetails = await getShippingDetails(req.params.order_id);
		let billingDetails = await getBillingDetails(req.params.order_id);
		let products = await getOrderProducts(req.params.order_id);

		let data = {
			order: order[0],
			shipping: shippingDetails[0],
			billing: billingDetails[0],
			products
		}

		return res.status(200).send({ success: 1, message: "Fetched successfully", data: data });

	} catch (error) {
		console.log(error);
		return res.status(500).send({
			success: 0,
			message: "Something went wrong"
		});
	}
}

function validate(method) {
	switch (method) {
		case 'submitOrder': {
			return [
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
			return [
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

function submitOrder(req, res, next) {
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

	} catch (err) {
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

async function editOrder(req, res, next) {
	try {
		let status = 0;
		if (!req.session.userdata) {
			status = 1;
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() });
			return;
		}

		let validator = new Validator(req.body, {
			order_id: 'required|maxLength:11',
			order_type: 'required',
			'shipping': 'required|object',
			'shipping.order_shipping_id': 'required',
			'shipping.first_name': 'required|maxLength:20',
			'shipping.last_name': 'maxLength:20',
			'shipping.address': 'required',
			'shipping.pincode': 'required|maxLength:15',
			'shipping.city': 'required',
			'shipping.phone': 'required',
			'billing': 'required|object',
			'billing.order_billing_id': 'required',
			'billing.first_name': 'required|maxLength:20',
			'billing.last_name': 'required|maxLength:20',
			'billing.address': 'required',
			'billing.pincode': 'required|maxLength:15',
			'billing.city': 'required',
			'billing.phone': 'required',
			'billing.gst_number': 'minLength:15',
			'products': 'required|array',
			'products.*.order_product_id': 'required',
			'products.*.product_name': 'required',
			'products.*.product_quantity': 'required',
			'products.*.product_amount': 'required',
			weight: 'required',
			dimensions: 'required',
			shipping_charge: 'required',
			cod_charge: 'required',
			tax_charge: 'required',
			discount: 'required'
		});

		let matched = await validator.check();

		if (!matched) {
			let errorMessage = validation.parsevalidation(validator.errors);
			return res.status(422).send({ success: 0, message: errorMessage });
		}

		let orderExist = await checkOrderIdExist(req.body.order_id);

		if (orderExist && orderExist.length == 0) {
			return res.status(422).send({
				success: 0,
				message: "Order not found"
			});
		}

		let orderBody = {
			order_id: req.body.order_id,
			order_type: req.body.order_type,
			weight: req.body.weight,
			dimentions: req.body.dimensions,
			shipping_charge: req.body.shipping_charge,
			cod_charge: req.body.cod_charge,
			tax_charge: req.body.tax_charge,
			discount: req.body.discount
		}

		let order = await editOrderService(orderBody);

		if (!order) {
			return res.status(500).send({ success: 0, message: "Something went wrong" });
		}

		let shippingBody = {
			order_shipping_id: req.body.shipping.order_shipping_id,
			order_id: req.body.order_id,
			first_name: req.body.shipping.first_name,
			last_name: req.body.shipping.last_name,
			company_name: req.body.shipping.company_name || '',
			address: req.body.shipping.address,
			address2: req.body.shipping.address2,
			pincode: req.body.shipping.pincode,
			city: req.body.shipping.city,
			state: req.body.shipping.state,
			phone: req.body.shipping.phone
		};

		let shipping = await editShippingAddress(shippingBody);

		if (!shipping) {
			console.error(shipping);
			return res.status(500).send({ success: 0, message: "Something went wrong" });
		}

		let billingBody = {
			order_billing_id: req.body.billing.order_billing_id,
			order_id: req.body.order_id,
			first_name: req.body.billing.first_name,
			last_name: req.body.billing.last_name,
			company_name: req.body.billing.company_name || '',
			address: req.body.billing.address,
			address2: req.body.billing.address2,
			pincode: req.body.billing.pincode,
			city: req.body.billing.city,
			state: req.body.billing.state,
			phone: req.body.billing.phone,
			gst_number: req.body.billing.gst_number | ''
		};

		let billing = await editBillingAddress(billingBody);

		if (!billing) {
			console.error(billing);
			return res.status(500).send({ success: 0, message: "Something went wrong" });
		}

		for (let product of req.body.products) {
			let productResult = await editOrderProductService(product);

			if (!productResult) {
				console.error(productResult);
				return res.status(500).send({ success: 0, message: "Something went wrong" });
			}
		}

		return res.status(200).send({ success: 1, message: "Order updated successfully" });

	} catch (error) {
		console.log(error);
		return res.status(500).send({
			success: 0,
			message: "Something went wrong"
		});
	}

	/* var body = req.body.id;
	getOrder(body, (err, results) => {
		if (err) {
			return res.status(500).json({
				success: 0,
				message: "Database connection error"
			});
		}
		res.render('editOrder', { title: 'Express', layout: false, status: status, results: results, data: {}, errors: {} });
	}); */
}

async function updateOrderStatus(req, res, next) {
	try {

		let status = 0;
		if (!req.session.userdata) {
			status = 1;
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() });
			return;
		}

		let validator = new Validator(req.body, {
			order_status: 'required|maxLength:1'
		});

		let matched = await validator.check();

		if (!matched) {
			let errorMessage = validation.parsevalidation(validator.errors);
			return res.status(422).send({ success: 0, message: errorMessage });
		}
		
		const { order_status } = req.body;

		let orderExist = await checkOrderIdExist(req.params.order_id);

		if (orderExist && orderExist.length == 0) {
			return res.status(422).send({
				success: 0,
				message: "Order not found"
			});
		}

		let order = await updateOrderStatusService(req.params.order_id, order_status);
			
		return res.status(200).send({ success: 1, message: "Order updated successfully" });

	} catch (error) {
		console.log(error);
		return res.status(500).send({
			success: 0,
			message: "Something went wrong"
		});
	}
}

function updateOrder(req, res, next) {
	try {
		let status = 0;
		if (!req.session.userdata) {
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

	} catch (err) {
		return next(err)
	}
}

function allOrder(req, res, next) {
	let status = 0;
	if (!req.session.userdata) {
		status = 1;
	}

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
		return;
	}

	allOrder()
}

module.exports = { createOrder, submitOrder, validate, editOrder, updateOrder, allOrder, getOrder, updateOrderStatus }