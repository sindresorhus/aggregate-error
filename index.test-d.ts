import {expectType, expectAssignable} from 'tsd';
import AggregateError from './index.js';

const aggregateError = new AggregateError([
	new Error('foo'),
	{foo: 'bar'},
	'bar'
]);
expectAssignable<Iterable<Error>>(aggregateError.errors);
expectType<IterableIterator<Error>>(aggregateError.errors[Symbol.iterator]());

for (const error of aggregateError.errors) {
	expectType<Error>(error);
}

class CustomError extends Error {
	public foo: string;

	constructor(message: string) {
		super(message);
		this.name = 'CustomError';
		this.foo = 'bar';
	}
}
const customAggregateError = new AggregateError<CustomError>([
	new CustomError('foo')
]);

for (const error of customAggregateError.errors) {
	expectType<string>(error.foo);
}
