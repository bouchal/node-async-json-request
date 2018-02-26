import JsonRequest from '../src/JsonRequest';
import mockServerFactory from './mock/mockServer'

const TEST_JSON_BASE_URL = 'http://127.0.0.1';
const TEST_SERVER_PORT = 9999;
const TEST_GET_JSON_URI = '/get';
const TEST_POST_JSON_URI = '/post';
const TEST_PUT_JSON_URI = '/put';
const TEST_GET_CUSTOM_HEADERS_URI = '/custom-headers';

const TEST_POST_DATA = {
	testData: 'test_' + Date.now()
};

const TEST_PUT_DATA = {
	testPutData: 'test_' + Date.now()
};

const TEST_TOKEN = 'testToken';

const testApi = new JsonRequest(TEST_JSON_BASE_URL + ':' + TEST_SERVER_PORT);
const testOptionsApi = new JsonRequest(TEST_JSON_BASE_URL + ':' + TEST_SERVER_PORT, {
	headers: {
		'x-token': TEST_TOKEN
	}
});
let mockServer = null;

describe('Request', function () {
	this.timeout(10000);

	before((done) => {
		mockServerFactory(TEST_SERVER_PORT, (server) => {
			mockServer = server;
			done();
		})
	});

	after((done) => {
		mockServer.close();
		done();
	});

	describe('Usage methods', () => {
		it('should work with async/await', async (done) => {
			const result = await testApi.get(TEST_GET_JSON_URI);

			if (!result.success) {
				return done('Request return wrong data');
			}

			done();
		});

		it('should work with promise', async (done) => {
			testApi.get(TEST_GET_JSON_URI).then((result) => {
				if (!result.success) {
					return done('Request return wrong data');
				}

				done();
			}, done);
		});
	});


	describe('Other request methods', () => {
		it('should work with POST', async (done) => {
			const result = await testApi.post(TEST_POST_JSON_URI, TEST_POST_DATA);

			if (!result.receivedData.testData == TEST_POST_DATA.testData) {
				return done('Request return wrong data');
			}

			done();
		});

		it('should work with PUT', async (done) => {
			const result = await testApi.put(TEST_PUT_JSON_URI, TEST_PUT_DATA);

			if (!result.receivedData.testPutData == TEST_PUT_DATA.testPutData) {
				return done('Request return wrong data');
			}

			done();
		});
	});

	describe('Working with options', () => {
		it('should send x-token in headers', async (done) => {
			const result = await testOptionsApi.get(TEST_GET_CUSTOM_HEADERS_URI);

			if (!result.headers['x-token'] == TEST_TOKEN) {
				return done('Request return wrong headers');
			}

			done();
		});
	})
});