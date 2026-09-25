/**
Create an error from multiple errors.
*/
export default class AggregateError<T extends Error = Error> extends Error {
	readonly name: 'AggregateError';

	readonly errors: readonly [T];

	/**
	@param errors - If a string, a new `Error` is created with the string as the error message. If a non-Error object, a new `Error` is created with all properties from the object copied over.

	@example
	```
	import AggregateError from 'aggregate-error';

	const error = new AggregateError([new Error('foo'), 'bar', {message: 'baz'}]);

	throw error;

	// AggregateError:
	//	Error: foo
	//		at Object.<anonymous> (/Users/sindresorhus/dev/aggregate-error/example.js:3:33)
	//	Error: bar
	//		at Array.map (<anonymous>)
	//		at Object.<anonymous> (/Users/sindresorhus/dev/aggregate-error/example.js:3:13)
	//	Error: baz
	//		at Array.map (<anonymous>)
	//		at Object.<anonymous> (/Users/sindresorhus/dev/aggregate-error/example.js:3:13)

	for (const individualError of error.errors) {
		console.log(individualError.message);
	}
	//=> foo
	//=> bar
	//=> baz
	```
	*/
	constructor(errors: ReadonlyArray<T | Record<string, any> | string>);
}
