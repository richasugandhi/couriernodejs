async function submitOrder(data, callback) {
	const result = await db.query(`INSERT INTO  tbl_orders(channel, corder, date, product, 
		payment, method, customer, zipcode, weight, ivr_status, tags, status) values(?,?,?,?,?,?,?,?,?,?,?,?)`,
		[data.channel, data.corder, data.date, data.product, data.payment, data.method,
		data.customer, data.zipcode, data.weight, data.ivr_status, data.tags, data.status],
		(errors, results, fields) => {
			if (errors) {
				return callback(errors);
			}
			return callback(null, results);
		});
}


async function getOrder(data, callback) {
	const result = await db.query(`SELECT * FROM tbl_orders WHERE id = ($1)`, [data.id], (errors, results, fields) => {
		if (errors) {
			return callback(errors);
		}
		return callback(null, results);
	});
}


async function updateOrder(data, callback) {
	const result = await db.query(`UPDATE tbl_orders SET channel=?, corder=?, date=?, product=?, payment=?, method=?, customer=?, zipcode=?, weight=?, ivr_status=?, tags=?, status=? WHERE id=?`,
		[data.channel, data.corder, data.date, data.product, data.payment, data.method, data.customer, data.zipcode, data.weight, data.ivr_status, data.tags, data.status, data.id], (errors, results, fields) => {
			if (errors) {
				return callback(errors);
			}
			return callback(null, results);
		});
}

async function allOrder(data, callback) {
	const result = await db.query(`SELECT * FROM tbl_orders`, (errors, results, fields) => {
		if (errors) {
			return callback(errors);
		}
		return callback(null, results);
	});
}

async function addOrder(data) {
	return await db.awaitQuery("INSERT INTO `orders` (`order_id`, `order_type`, `weight`, `dimentions`, `shipping_charge`, `cod_charge`, `tax_charge`, `discount`, `is_deleted`, `created_date`, `updated_date`) VALUES (?,?,?,?,?,?,?,?,0,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", [data.order_id, data.order_type, data.weight, data.dimentions, data.shipping_charge, data.cod_charge, data.tax_charge, data.discount]);

}

async function checkOrderIdExist(orderId) {
	return await db.awaitQuery("SELECT * from `orders` where order_id = ? LIMIT 1", [orderId]);
}

async function addShippingAddress(data) {
	return await db.awaitQuery("INSERT INTO `order_shipping` (`order_id`, `first_name`, `last_name`, `company_name`, `address`, `address2`, `pincode`, `city`, `state`, `phone`, `created_date`, `updated_date`) VALUES (?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", [data.order_id, data.first_name, data.last_name, data.company_name, data.address, data.address2, data.pincode, data.city, data.state, data.phone]);
}

async function addBillingAddress(data) {
	return await db.awaitQuery("INSERT INTO `order_billing` (`order_id`, `first_name`, `last_name`, `company_name`, `address`, `address2`, `pincode`, `city`, `state`, `phone`, `gst_number`, `created_date`, `updated_date`) VALUES (?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", [data.order_id, data.first_name, data.last_name, data.company_name, data.address, data.address2, data.pincode, data.city, data.state, data.phone, data.gst_number]);
}

async function addOrderProducts(data) {
	return await db.awaitQuery("INSERT INTO `order_products` (`order_id`, `product_name`, `quantity`, `amount`, `sku`, `is_deleted`, `created_date`, `updated_date`) VALUES (?,?,?,?,?,0,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", [data.order_id, data.product_name, data.product_quantity, data.product_amount, data.sku]);
}

async function getShippingDetails(orderId) {
	return await db.awaitQuery("SELECT * FROM `order_shipping` WHERE order_id = ?", [orderId]);
}

async function getBillingDetails(orderId) {
	return await db.awaitQuery("SELECT * FROM `order_billing` WHERE order_id = ?", [orderId]);
}

async function getOrderProducts(orderId) {
	return await db.awaitQuery("SELECT * FROM `order_products` WHERE order_id = ? AND is_deleted = false", [orderId]);
}

async function editOrderService(data) {
	return await db.awaitQuery("UPDATE `orders` SET order_type = ?, weight = ?, dimentions = ?, shipping_charge = ?, cod_charge = ?, tax_charge = ?, discount = ? WHERE order_id = ? LIMIT 1", [data.order_type, data.weight, data.dimentions, data.shipping_charge, data.cod_charge, data.tax_charge, data.discount, data.order_id]);
}

async function editShippingAddress(data) {
	return await db.awaitQuery("UPDATE `order_shipping` SET first_name = ?, last_name = ?, company_name = ?, address = ?, address2 = ?, pincode = ?, city = ?, state = ?, phone = ? WHERE order_shipping_id = ?", [data.first_name, data.last_name, data.company_name, data.address, data.address2, data.pincode, data.city, data.state, data.phone, data.order_shipping_id]);
}

async function editBillingAddress(data) {
	return await db.awaitQuery("UPDATE `order_billing` SET first_name = ?, last_name = ?, company_name = ?, address = ?, address2 = ?, pincode = ?, city = ?, state = ?, phone = ? WHERE order_billing_id = ?", [data.first_name, data.last_name, data.company_name, data.address, data.address2, data.pincode, data.city, data.state, data.phone, data.order_billing_id]);
}

async function editOrderProductService(data) {
	return await db.awaitQuery("UPDATE `order_products` SET product_name = ?, quantity = ?, amount = ?, sku = ?, is_deleted = ? WHERE order_product_id = ?", [data.product_name, data.product_quantity, data.product_amount, data.sku, data.is_deleted, data.order_product_id]);
}

async function updateOrderStatusService(orderId, orderStatus) {
	return await db.awaitQuery("UPDATE `orders` SET `order_status` = ? WHERE order_id = ?", [orderStatus, orderId]);
}

module.exports = { submitOrder, getOrder, allOrder, addOrder, checkOrderIdExist, addShippingAddress, addBillingAddress, addOrderProducts, getShippingDetails, getBillingDetails, getOrderProducts, editOrderService, editShippingAddress, editBillingAddress, editOrderProductService, updateOrderStatusService }