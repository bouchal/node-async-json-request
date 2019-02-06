Simple sending JSON requests via async/await or promises.

# Async JSON Request

[![Coverage Status](https://coveralls.io/repos/github/bouchal/node-async-json-request/badge.svg?branch=master)](https://coveralls.io/github/bouchal/node-async-json-request?branch=master)

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
	
	console.log(result.body);
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
    .wrap({
        headers: {
            'authorization': 'Bearer XYZ'
        }
    })
    .get('/posts/1');
```

All options are deep merged together.

### Typescript

If you know schema which return in body, you can use generic types for better suggestions.

```typescript
import JsonRequest from 'async-json-request';

interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const apiRequest = new JsonRequest('https://jsonplaceholder.typicode.com');

const printFirstPostTitle = async (): Promise<void> => {
    const response = await apiRequest.get<IPost>('/posts/1');

    const responseBody = response.body; // Now body will be suggest you IPost interface.
    
    console.log(`Title of first post is: ${responseBody.title}`);
}

printFirstPostTitle();
```