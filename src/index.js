const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerUI = require('swagger-ui-express');
const swaggerConfig = require('./swagger.json');
require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json());

const port = process.env.PORT;
async function getConnection() {
	const conex = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	});
	await conex.connect();
	return conex;
}
//Funciones para la creación/autenticación del token
const generateToken = (payload) => {
	const token = jwt.sign(payload, process.env.DB_KEY, { expiresIn: '1h' });
	return token;
};
const verifyToken = (token) => {
	try {
		const verifyTkn = jwt.verify(token, process.env.DB_KEY);
		return verifyTkn;
	} catch (error) {
		return null;
	}
};
const authenticate = (req, res, next) => {
	const bearer = req.headers['authorization'];
	if (!bearer) {
		return res.json({ error: 'No token' });
	}
	const token = bearer.split(' ')[1];
	const validate = verifyToken(token);
	if (!validate) {
		return res.json({ error: 'Incorrect token' });
	}
	req.user = validate;
	next();
};

server.listen(port, () => {
	console.log(`El servidor se está ejecutando en http://localhost:${port}`);
});

server.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerConfig));
//Endpoints CRUD
server.get('/books', async (req, res) => {
	const conex = await getConnection();
	const sql = 'SELECT * FROM books';
	const [result] = await conex.query(sql);
	conex.end();
	res.json({ Books: result });
});
server.get('/bookYear', async (req, res) => {
	const conex = await getConnection();
	const year = req.query.year;
	const sql = 'SELECT * FROM books where publishDate >= ?';
	const [result] = await conex.query(sql, [year]);
	conex.end();
	res.json(result);
});
server.post('/addBook', async (req, res) => {
	const { title, pages, price, publishDate, author, stock } = req.body;
	const conex = await getConnection();
	const sql =
		'INSERT INTO books (title, pages, price, publishDate, author, stock) values (?, ?, ?, ?, ?, ?)';
	const [result] = await conex.query(sql, [
		title,
		pages,
		price,
		publishDate,
		author,
		stock,
	]);
	conex.end();
	res.json({ success: true, message: 'Book inserted correctly' });
});
server.put('/books/:id', async (req, res) => {
	const conex = await getConnection();
	const info = req.body;
	const id = req.params.id;
	const { title, pages, price, publishDate, author, stock } = info;
	let sql =
		'UPDATE books SET title = ?, pages = ?, price = ?, publishDate = ?, author = ?, stock = ? WHERE bookId = ?';
	const [result] = await conex.query(sql, [
		title,
		pages,
		price,
		publishDate,
		author,
		stock,
		id,
	]);
	conex.end();
	res.json({ success: true, message: 'Book correctly updated' });
});
server.delete('/deleteBook', async (req, res) => {
	const conex = await getConnection();
	const id = req.query.id;
	const sql = 'DELETE FROM books WHERE bookId = ?';
	const [result] = await conex.query(sql, [id]);
	if (result.affectedRows > 0) {
		res.json({
			success: true,
			message: 'Book correctly deleted',
		});
	} else {
		res.json({
			success: false,
			message: 'Book you are trying to delete does not exist',
		});
	}
});

//Endpoints registrar/iniciar sesión
server.post('/register', async (req, res) => {
	const conex = await getConnection();
	const { email, nombre, direccion, password } = req.body;
	//Compruebo el email porque es el único que en la bd tiene unique
	const checkNewUser = 'SELECT * FROM usuarios WHERE email = ?';
	const [resultCheck] = await conex.query(checkNewUser, [email]);
	if (resultCheck.length === 0) {
		const passwordHashed = await bcrypt.hash(password, 10);
		const insertNewUser =
			'INSERT INTO usuarios (email, nombre, direccion, password) values (?, ?, ?, ?)';
		jwt.sign(password, process.env.DB_KEY, async (err, token) => {
			if (err) {
				res.status(400).send({ message: 'Error' });
			} else {
				const conex = await getConnection();
				const resultInsert = await conex.query(insertNewUser, [
					email,
					nombre,
					direccion,
					passwordHashed,
				]);
				conex.end();
				res.json({
					success: true,
					token: token,
				});
			}
		});
	} else {
		res.json({ success: false, message: 'Email already registered' });
	}
});
server.post('/login', async (req, res) => {
	const conex = await getConnection();
	const { email, password } = req.body;
	const selectUser = 'SELECT * FROM usuarios WHERE email = ?';
	const [resultSelect] = await conex.query(selectUser, [email]);
	if (resultSelect.length !== 0) {
		const rightPass = await bcrypt.compare(
			password,
			resultSelect[0].password
		);
		if (rightPass) {
			const infoToken = {
				id: resultSelect[0].id,
				email: resultSelect[0].email,
			};
			const token = generateToken(infoToken);
			res.json({ success: true, token: token });
		} else {
			res.json({ success: false, message: 'Invalid password' });
		}
	} else {
		res.json({ success: false, message: 'User does not exist' });
	}
});
server.get('/userProfile', authenticate, async (req, res) => {
	const conex = await getConnection();
	const sql = 'SELECT * FROM usuarios WHERE email = ?';
	const [result] = await conex.query(sql, [req.user.email]);
	conex.end();
	res.json({ success: true, user: result });
});
server.put('/logout', (req, res) => {
	jwt.sign(
		{ data: '' },
		process.env.DB_KEY,
		{ expiresIn: 1 },
		(error, logoutToken) => {
			if (!error) {
				res.json({ token: logoutToken, message: 'Successful logout' });
			} else {
				res.json({ message: 'Incorrect logout' });
			}
		}
	);
});
