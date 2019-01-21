import JsonRequest from '../src/JsonRequest';
import mockServerFactory from './mock/mockServer'
import {Server} from "http";

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

const testFullResponseApi = new JsonRequest(TEST_JSON_BASE_URL + ':' + TEST_SERVER_PORT, {}, true);
const testOptionsApi = new JsonRequest(TEST_JSON_BASE_URL + ':' + TEST_SERVER_PORT, {
    headers: {
        'x-token': TEST_TOKEN
    }
});

let mockServer: Server;

describe('Request', function () {
    this.timeout(10000);

    before((done) => {
        mockServerFactory(TEST_SERVER_PORT, (server: Server) => {
            mockServer = server;
            done();
        })
    });

    after((done) => {
        mockServer.close();
        done();
    });

    describe('Usage methods', () => {
        it('should work with async/await', async () => {
            const result = await testApi.get(TEST_GET_JSON_URI);

            if (!result.success) {
                throw Error('Request return wrong data');
            }
        });

        it('should work with promise', async () => {
            testApi.get(TEST_GET_JSON_URI).then((result: any) => {
                if (!result.success) {
                    throw Error('Request return wrong data');
                }
            }, (err: string) => {
                if (err) {
                    throw Error(err);
                }
            });
        });

        it('should return full response', async () => {
            testFullResponseApi.get(TEST_GET_JSON_URI).then((res: any) => {
                if (res.statusCode !== 200) {
                    throw Error('Request return wrong status code');
                }

                if (!res.body.success) {
                    throw Error('Request return wrong data');
                }

            }, (err: string) => {
                if (err) {
                    throw Error(err);
                }
            });
        })
    });


    describe('Other request methods', () => {
        it('should work with POST', async () => {
            const result = await testApi.post(TEST_POST_JSON_URI, null, TEST_POST_DATA);

            if (!(result.receivedData.testData === TEST_POST_DATA.testData)) {
                throw Error('Request return wrong data');
            }
        });

        it('should work with PUT', async () => {
            const result = await testApi.put(TEST_PUT_JSON_URI, null, TEST_PUT_DATA);

            if (!(result.receivedData.testPutData === TEST_PUT_DATA.testPutData)) {
                throw Error('Request return wrong data');
            }
        });

        it('should don\'t work with non-standard functions', async () => {
            try {
                testApi.someRandomFunction(TEST_GET_JSON_URI);
                testApi.then(TEST_GET_JSON_URI);
            } catch (e) {
                if (e.message.includes('is not a function')) {
                    return;
                }
            }

            throw new Error('Request should fail on "is not a function" error.')
        });
    });

    describe('Error handling', () => {
        it('should reject promise when request end with error', (done) => {
            const notExistedApiRequest = new JsonRequest('something wrong');

            notExistedApiRequest.get('/this is wrong').then((data) => {
                done('Request should end with error');
            }).catch((err) => {
                done();
            });
        })
    });

    describe('Working with options', () => {
        it('should send x-token in headers', async () => {
            const result = await testOptionsApi.get(TEST_GET_CUSTOM_HEADERS_URI);

            if (!(result.headers['x-token'] === TEST_TOKEN)) {
                throw Error('Request return wrong headers');
            }
        });
    });

    describe('working with additional extra options for request', async () => {
        it('should send x-token in headers', async () => {
            const result = await testApi
                .options({
                    headers: {
                        'x-token': TEST_TOKEN
                    }
                })
                .get(TEST_GET_CUSTOM_HEADERS_URI);

            if (result.headers['x-token'] !== TEST_TOKEN) {
                throw Error('Request return wrong headers');
            }
        });
    });
});