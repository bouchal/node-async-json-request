import request from "request";

export default class JsonRequest {
	/**
	 *
	 * @param apiBasePath
	 * @param defaultRequestOptions
	 */
	constructor(apiBasePath, defaultRequestOptions = {})
	{
		this.apiBasePath = apiBasePath;
		this._defaultRequestOptions = defaultRequestOptions;
	}

	/**
	 *
	 * @param method
	 * @param path
	 * @param data
	 * @param getData
	 * @return {Promise}
	 * @private
	 */
	_runRequest(method, path, data = null, getData = null)
	{
		const url = this.apiBasePath + path;

		var options = {
			...this._defaultRequestOptions,
			url,
			method
		};

		options.json = true;

		if(!('headers' in options)) {
			options.headers = {};
		}

		options.headers['content-type'] = 'application/json';

		if(data) {
			options.body = data;
		} else if(getData) {
			options.qs = getData;
		}

		return new Promise((resolve, reject) =>
		{
			request(options, (err, res, data) =>
			{
				if(err) {
					return reject(err)
				}

				resolve(data)
			});
		});
	}

	get(path, data = null)
	{
		return this._runRequest('GET', path, null, data);
	}

	put(path, data)
	{
		return this._runRequest('PUT', path, data, null)
	}

	post(path, data = null)
	{
		return this._runRequest('POST', path, data, null);
	}
}