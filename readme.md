# aggregate-error

> Create an error from multiple errors

*Note: With [Node.js 15](https://medium.com/@nodejs/node-js-v15-0-0-is-here-deb00750f278), there's now a built-in [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) type.*

## Install

```sh
npm install aggregate-error
```

## Usage

```js
import AggregateError from 'aggregate-error';

const error = new AggregateError([new Error('foo'), 'bar', {message: 'baz'}]);

throw error;
/*
AggregateError:
    Error: foo
        at Object.<anonymous> (/Users/sindresorhus/dev/aggregate-error/example.js:3:33)
    Error: bar
        at Array.map (<anonymous>)
        at Object.<anonymous> (/Users/sindresorhus/dev/aggregate-error/example.js:3:13)
    Error: baz
        at Array.map (<anonymous>)
        at Object.<anonymous> (/Users/sindresorhus/dev/aggregate-error/example.js:3:13)
*/

for (const individualError of error.errors) {
	console.log(individualError.message);
}
//=> foo
//=> bar
//=> baz
```

## API

### AggregateError(errors)

Returns an `Error`.

#### errors

Type: `Array<Error|object|string>`

If a string, a new `Error` is created with the string as the error message.\
If a non-Error object, a new `Error` is created with all properties from the object copied over.
