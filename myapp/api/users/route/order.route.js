var express = require('express');
var router = express.Router();

var { createOrder, submitOrder, validate, editOrder, updateOrder, allOrder, getOrder, updateOrderStatus} = require("../controllers/order.controller");
var sess;


router.get('/order/all', allOrder);

router.post('/create', createOrder);
router.get('/:order_id', getOrder);
router.put('/edit', editOrder);
router.put('/update_order_status/:order_id', updateOrderStatus);

// router.post('/order/create', validate('submitOrder'), submitOrder);

router.get('/order/edit/:id', editOrder);

router.post('/order/update', validate('updateOrder'), updateOrder);


module.exports = router;