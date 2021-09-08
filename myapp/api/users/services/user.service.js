async function create(data, callback){
	const result = await db.query(`INSERT INTO registration(first_name, last_name, email, password, contact_no, company_name, role) values(?,?,?,?,?,?,?)`,
		[data.first_name,data.last_name,data.email,data.password,data.phone,data.companyname,data.role],
		(errors, results, fields) => {
			if(errors) {
				return callback(errors);
			}
			return callback(null, results);
		});
}

async function login(data, callback){
	const results = await db.query(`SELECT * FROM registration WHERE email = ?`, [data.email],
		(errors, results, fields) => {
			if(errors) {
				return callback(errors);
			}
			return callback(null, results);
		});
}

async function checkEmail(data, callback, next) {
	const results = await db.query(`SELECT * FROM registration WHERE email = ?`, [data.email],
		(errors, results, fields) => {
			if(errors) {
				return callback(errors);
			}
			return callback(null, results, next);
		});
}

module.exports = { create, login, checkEmail }