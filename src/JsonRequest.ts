import * as request from "request";
import * as deepmerge from "deepmerge";
import {CoreOptions} from "request";
import {Request} from "request";
import {ResponseAsJSON} from "request";
import {IncomingMessage} from "http";
import {Caseless} from "caseless";


interface Response<T = any> extends IncomingMessage {
    statusCode: number;
    statusMessage: string;
    request: Request;
    body: T; // Buffer, string, stream.Readable, or a plain object if `json` was truthy
    caseless: Caseless; // case-insensitive access to headers
    toJSON(): ResponseAsJSON;

    timingStart?: number;
    elapsedTime?: number;
    timings?: {
        socket: number;
        lookup: number;
        connect: number;
        response: number;
        end: number;
    };
    timingPhases?: {
        wait: number;
        dns: number;
        tcp: number;
        firstByte: number;
        download: number;
        total: number;
    };
}

class JsonRequest {
    protected readonly baseUrl: string;

    protected readonly defaultRequestOptions: object;

    constructor(baseUrl: string, defaultRequestOptions: object = {}) {
        this.baseUrl = baseUrl;
        this.defaultRequestOptions = defaultRequestOptions;
    }


    protected runRequest(method: string, path: string, parameters?: object | null, body?: object | null): Promise<Response> {
        const url = this.baseUrl + path;

        const options: any = {
            ...this.defaultRequestOptions,
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

                resolve(res);
            });
        });
    }

    public get<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('get', path, parameters, body);
    }

    public post<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('post', path, parameters, body);
    }

    public put<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('put', path, parameters, body);
    }

    public head<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('head', path, parameters, body);
    }

    public delete<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('delete', path, parameters, body);
    }

    public options<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('options', path, parameters, body);
    }

    public trace<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('trace', path, parameters, body);
    }

    public copy<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('copy', path, parameters, body);
    }

    public lock<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('lock', path, parameters, body);
    }

    public mkcol<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('mkcol', path, parameters, body);
    }

    public move<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('move', path, parameters, body);
    }

    public purge<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('purge', path, parameters, body);
    }

    public propfind<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('propfind', path, parameters, body);
    }

    public proppatch<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('proppatch', path, parameters, body);
    }

    public unlock<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('unlock', path, parameters, body);
    }

    public report<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('report', path, parameters, body);
    }

    public mkactivity<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('mkactivity', path, parameters, body);
    }

    public checkout<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('checkout', path, parameters, body);
    }

    public merge<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('merge', path, parameters, body);
    }

    public 'm-search'<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('m-search', path, parameters, body);
    }

    public notify<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('notify', path, parameters, body);
    }

    public subscribe<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('subscribe', path, parameters, body);
    }

    public unsubscribe<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('unsubscribe', path, parameters, body);
    }

    public patch<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('patch', path, parameters, body);
    }

    public search<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('search', path, parameters, body);
    }

    public connect<T = any>(path: string, parameters?: object | null, body?: object | null): Promise<Response<T>> {
        return this.runRequest('connect', path, parameters, body);
    }

    /**
     * Create and return new instance of JsonRequest with merged options.
     *
     * @param extraOptions
     */
    public wrap(extraOptions: CoreOptions): JsonRequest {
        const mergedOptions = deepmerge(this.defaultRequestOptions, extraOptions);

        return new JsonRequest(this.baseUrl, mergedOptions);
    }
}

export default JsonRequest;