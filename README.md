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

- __.get(URI, DATA)__
- __.post(URI, DATA)__
- __.put(URI, DATA)__

### Custom default request options

```javascript
import JsonRequest from 'async-json-request';

const apiRequest = new JsonRequest('https://jsonplaceholder.typicode.com', {
	headers: {
		'x-token': 'TOKEN'
	}
});
```
