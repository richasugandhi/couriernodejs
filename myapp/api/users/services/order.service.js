async function submitOrder(data, callback){
	const result = await db.query(`INSERT INTO  tbl_orders(channel, corder, date, product, 
		payment, method, customer, zipcode, weight, ivr_status, tags, status) values(?,?,?,?,?,?,?,?,?,?,?,?)`,
		[data.channel,data.corder,data.date,data.product,data.payment,data.method,
		data.customer,data.zipcode,data.weight,data.ivr_status,data.tags,data.status],
		(errors, results, fields) => {
			if(errors) {
				return callback(errors);
			}
			return callback(null, results);
		});
}


async function getOrder(data, callback) {
	const result = await db.query(`SELECT * FROM tbl_orders WHERE id = ($1)`, [data.id], (errors, results, fields) => {
		if(errors) {
			return callback(errors);
		}
		return callback(null, results);
	});
}


async function updateOrder(data, callback) {
	const result = await db.query(`UPDATE tbl_orders SET channel=?, corder=?, date=?, product=?, payment=?, method=?, customer=?, zipcode=?, weight=?, ivr_status=?, tags=?, status=? WHERE id=?`, 
		[data.channel,data.corder,data.date,data.product,data.payment,data.method,data.customer,data.zipcode,data.weight,data.ivr_status,data.tags,data.status,data.id], (errors, results, fields) => {
		if(errors) {
			return callback(errors);
		}
		return callback(null, results);
	});
}

async function allOrder(data, callback) {
	const result = await db.query(`SELECT * FROM tbl_orders`, (errors, results, fields) => {
		if(errors) {
			return callback(errors);
		}
		return callback(null, results);
	});
}


module.exports = { submitOrder, getOrder, allOrder }