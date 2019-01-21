import * as request from "request";
import * as deepmerge from "deepmerge";
import {Response} from "request";
import * as allowedMethods from "methods";

interface IPromiseMethod {
    (path: string, parameters?: object|null, body?: object|null): Promise<any>;
}

interface IOptionsMethod {
    (extraOptions: object): IJsonRequestAPI
}

export type IJsonRequestAPI = {
    [key: string]: IPromiseMethod;
} & {
    options: IOptionsMethod;
}

class JsonRequest {
    protected readonly baseUrl: string;

    protected readonly defaultRequestOptions: object;

    protected readonly fullResponse: boolean;

    constructor(baseUrl: string, defaultRequestOptions: object = {}, fullResponse: boolean = false) {
        this.baseUrl = baseUrl;
        this.defaultRequestOptions = defaultRequestOptions;
        this.fullResponse = fullResponse;
    }

    public getProxy(extraOptions: object = {}): IJsonRequestAPI {
        return new Proxy(this, {
            get: (target: any, name: string) => {
                if (name === 'options') {
                    return target.getOptionsMethod();
                }

                if (allowedMethods.indexOf(name.toString().toLowerCase()) === -1) {
                    return undefined;
                }

                return target.getMethod(name, extraOptions);
            }
        });
    }

    protected getOptionsMethod(): Function {
        const self = this;

        return function (extraOptions: object) {
            return self.getProxy(extraOptions)
        };
    }


    protected getMethod(method: string, extraOptions: object = {}) {
        const self = this;

        const reqOptions = deepmerge(this.defaultRequestOptions, extraOptions);

        return function (path: string, parameters?: object, body?: object) {
            return self.runRequest(
                method.toUpperCase(),
                reqOptions,
                path,
                parameters,
                body
            )
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
    protected runRequest(method: string, reqOptions: object, path: string, parameters?: object, body?: object) {
        const url = this.baseUrl + path;

        const options: any = {
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
            request(options, (err: Error, res: Response, data: any) => {
                if (err) {
                    return reject(err)
                }

                resolve(this.fullResponse ? res : data);
            });
        });
    }
}

interface IJsonRequestConstructor {
    new(baseUrl: string, defaultRequestOptions?: object, fullResponse?: boolean): IJsonRequestAPI;

    (baseUrl: string, defaultRequestOptions?: object, fullResponse?: boolean): IJsonRequestAPI;
}

const JsonRequestConstructor: IJsonRequestConstructor = function (baseUrl: string, defaultRequestOptions: object = {}, fullResponse: boolean = false): IJsonRequestAPI {
    return new JsonRequest(baseUrl, defaultRequestOptions, fullResponse).getProxy();
} as IJsonRequestConstructor;

export default JsonRequestConstructor;