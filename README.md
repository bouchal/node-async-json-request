Simple sending JSON requests via async/await or promises.

# Async JSON Request

## Installation

```
npm i async-json-request --save
```

## Usage

### Basic request sending

```javascript
import JsonRequest from 'async-json-request';

const apiRequest = new JsonRequest('https://jsonplaceholder.typicode.com');

const printData = async () => {
	const result = await apiRequest.get('/posts/1');
	
	console.log(result);
};

printData();
```

### Methods

- __.get(URI, PARAMETERS)__
- __.post(URI, PARAMETERS, BODY)__
- __.put(URI, PARAMETERS, BODY)__
- ...and every other possible methods

### Custom default request options

```javascript
import JsonRequest from 'async-json-request';

const apiRequest = new JsonRequest('https://jsonplaceholder.typicode.com', {
	headers: {
		'x-token': 'TOKEN'
	}
});
```

### Custom additional options for specific request

```javascript
import JsonRequest from 'async-json-request';

const apiRequest = new JsonRequest('https://jsonplaceholder.typicode.com', {
	headers: {
		'x-token': 'TOKEN'
	}
});

const result = apiRequest
    .options({
        headers: {
            'authorization': 'Bearer XYZ'
        }
    })
    .get('/posts/1');
```

All options are deep merged together.

### Returning full response object

Sometimes you need return full response object for check status code or returned headers.

For it you can set third parameter of JsonRequest to true.

```javascript
import JsonRequest from 'async-json-request';

const apiRequest = new JsonRequest('https://jsonplaceholder.typicode.com', {}, true);

const printStatusCode = async () => {
	const result = await apiRequest.get('/posts/1');
	
	console.log(result.statusCode, result.body);
};

printStatusCode();
```