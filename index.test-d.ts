import {expectType} from 'tsd-check';
import AggregateError from '.';

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
