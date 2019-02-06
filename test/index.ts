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
const TEST_TOKEN2 = 'test2Token2';

const testApi = new JsonRequest(TEST_JSON_BASE_URL + ':' + TEST_SERVER_PORT);

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

            if (!result.body.success) {
                throw Error('Request return wrong data');
            }
        });

        it('should work with promise', async () => {
            testApi.get(TEST_GET_JSON_URI).then((result: any) => {
                if (!result.body.success) {
                    throw Error('Request return wrong data');
                }
            }, (err: string) => {
                if (err) {
                    throw Error(err);
                }
            });
        });
    });


    describe('Other request methods', () => {
        it('should work with POST', async () => {
            const result = await testApi.post(TEST_POST_JSON_URI, null, TEST_POST_DATA);

            if (!(result.body.receivedData.testData === TEST_POST_DATA.testData)) {
                throw Error('Request return wrong data');
            }
        });

        it('should work with PUT', async () => {
            const result = await testApi.put(TEST_PUT_JSON_URI, null, TEST_PUT_DATA);

            if (!(result.body.receivedData.testPutData === TEST_PUT_DATA.testPutData)) {
                throw Error('Request return wrong data');
            }
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

            if (!(result.body.headers['x-token'] === TEST_TOKEN)) {
                throw Error('Request return wrong headers');
            }
        });
    });

    describe('working with additional extra options for request', async () => {
        it('should send x-token in headers', async () => {
            const result = await testApi
                .wrap({
                    headers: {
                        'x-token': TEST_TOKEN
                    }
                })
                .get(TEST_GET_CUSTOM_HEADERS_URI);


            if (result.body.headers['x-token'] !== TEST_TOKEN) {
                throw Error('Request return wrong headers');
            }
        });

        it('shouldn\'t change original instance options' , async () => {
            const original = testApi
                .wrap({
                    headers: {
                        'x-token': TEST_TOKEN
                    }
                });

            const clone = original.wrap({
                headers: {
                    'x-token': TEST_TOKEN2
                }
            });

            const result = await original.get(TEST_GET_CUSTOM_HEADERS_URI);

            if (result.body.headers['x-token'] !== TEST_TOKEN) {
                throw Error('Request return wrong headers');
            }
        });
    });
});