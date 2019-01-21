import * as express from 'express';
import * as bodyParser from 'body-parser'
const app = express();

app.use(bodyParser.json());

app.get('/get', (req: express.Request, res: express.Response) => {
	res.json({
		success: true
	})
});

app.post('/post', (req: express.Request, res: express.Response) => {
	res.json({
		receivedData: req.body
	})
});

app.put('/put', (req: express.Request, res: express.Response) => {
	res.json({
		receivedData: req.body
	})
});

app.get('/custom-headers', (req: express.Request, res: express.Response) => {
	res.json({
		headers: req.headers
	})
});

export default (port: number, done: Function) => {
	const server = app.listen(port, () => {
		done(server);
	});
}