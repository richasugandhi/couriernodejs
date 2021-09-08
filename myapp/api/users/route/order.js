var express = require('express');
var router = express.Router();

var { createOrder, submitOrder, validate, editOrder, updateOrder, allOrder } = require("../controllers/order.controller");
var sess;


router.get('/order/all', allOrder);

router.get('/order/create', createOrder);

router.post('/order/create', validate('submitOrder'), submitOrder);

router.get('/order/edit/:id', editOrder);

router.post('/order/update', validate('updateOrder'), updateOrder);


module.exports = router;