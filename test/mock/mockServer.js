import express from 'express';
import bodyParser from 'body-parser'
const app = express();

app.use(bodyParser.json());

app.get('/get', (req, res) => {
	res.json({
		success: true
	})
});

app.post('/post', (req, res) => {
	res.json({
		receivedData: req.body
	})
});

app.put('/put', (req, res) => {
	res.json({
		receivedData: req.body
	})
});

app.get('/custom-headers', (req, res) => {
	res.json({
		headers: req.headers
	})
});

export default (port, done) => {
	const server = app.listen(port, () => {
		done(server);
	});
}