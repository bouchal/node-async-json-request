import request from "request";
import deepmerge from "deepmerge";

const allowedMethods = [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ];

export default class JsonRequest {
    /**
     *
     * @param apiBasePath
     * @param defaultRequestOptions
     * @param fullResponse
     */
    constructor(apiBasePath, defaultRequestOptions = {}, fullResponse = false) {
        this._apiBasePath = apiBasePath;
        this._defaultRequestOptions = defaultRequestOptions;
        this._fullRepsonse = fullResponse;

        return this._getProxy();
    }

    _getProxy(extraOptions = {}) {
        return new Proxy(this, {
            get: (target, name, receiver) => {
                if (name === 'options') {
                    return target._getOptionsMethod();
                }

                if (allowedMethods.indexOf(name.toString().toUpperCase()) === -1) {
                    return undefined;
                }

                return target._getMethod(name, extraOptions);
            }
        });
    }

    _getOptionsMethod() {
        const self = this;

        return function (extraOptions) {
            return self._getProxy(extraOptions)
        };
    }


    _getMethod(method, extraOptions = {}) {
        const self = this;

        const reqOptions = deepmerge(this._defaultRequestOptions, extraOptions);

        return function () {
            return self._runRequest(
                method.toUpperCase(),
                reqOptions,
                ...arguments);
        }
    }


    /**
     *
     * @param method
     * @param reqOptions
     * @param path
     * @param body
     * @param parameters
     * @return {Promise}
     * @private
     */
    _runRequest(method, reqOptions, path, parameters, body) {
        const url = this._apiBasePath + path;

        const options = {
            ...reqOptions,
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

                resolve(this._fullRepsonse ? res : data);
            });
        });
    }
}
