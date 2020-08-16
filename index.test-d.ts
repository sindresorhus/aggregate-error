import {expectType} from 'tsd';
import AggregateError = require('.');

const aggregateError = new AggregateError([
	new Error('foo'),
	{foo: 'bar'},
	'bar'
]);
expectType<Iterable<Error>>(aggregateError);
expectType<IterableIterator<Error>>(aggregateError[Symbol.iterator]());

for (const error of aggregateError) {
	expectType<Error>(error);
}

interface CustomError extends Error {
	foo: string;
}
const customAggregateError = new AggregateError<CustomError>([
	new Error('foo')
]);

for (const error of customAggregateError) {
	expectType<string>(error.foo);
}
