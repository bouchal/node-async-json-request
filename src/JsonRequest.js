import request from "request";

const allowedMethods = [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ];

export default class JsonRequest {
    /**
     *
     * @param apiBasePath
     * @param defaultRequestOptions
     */
    constructor(apiBasePath, defaultRequestOptions = {}) {
        this.apiBasePath = apiBasePath;
        this._defaultRequestOptions = defaultRequestOptions;

        return new Proxy(this, {
            get: function (target, name, receiver) {
                if (allowedMethods.indexOf(name.toString().toUpperCase()) === -1) {
                    return undefined;
                }

                return target._getMethod(name);
            }
        });
    }


    _getMethod(method) {
        const self = this;

        return function () {
            return self._runRequest(method.toUpperCase(), ...arguments);
        }
    }


    /**
     *
     * @param method
     * @param path
     * @param body
     * @param parameters
     * @return {Promise}
     * @private
     */
    _runRequest(method, path, parameters, body) {
        const url = this.apiBasePath + path;

        const options = {
            ...this._defaultRequestOptions,
            url,
            method
        };

        options.json = true;

        if (!('headers' in options)) {
            options.headers = {};
        }

        options.headers['content-type'] = 'application/json';

        if (body) options.body = body;
        if (parameters) options.qs = parameters;

        return new Promise((resolve, reject) => {
            request(options, (err, res, data) => {
                if (err) {
                    return reject(err)
                }

                resolve(data)
            });
        });
    }
}
