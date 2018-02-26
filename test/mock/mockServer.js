import express from 'express';

const app = express();

app.get('/get', (req, res) => {
	res.json({
		success: true
	})
});

app.post('/post', (req, res) => {
	res.json({
		receivedData: req.query
	})
});

app.put('/put', (req, res) => {
	res.json({
		receivedData: req.query
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