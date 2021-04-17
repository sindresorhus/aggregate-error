import {expectType, expectAssignable} from 'tsd';
import AggregateError from './index.js';

const aggregateError = new AggregateError([
	new Error('foo'),
	{foo: 'bar'},
	'bar'
]);
expectAssignable<Iterable<Error>>(aggregateError);
expectType<IterableIterator<Error>>(aggregateError[Symbol.iterator]());

for (const error of aggregateError) {
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

for (const error of customAggregateError) {
	expectType<string>(error.foo);
}
