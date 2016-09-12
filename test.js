import test from 'ava';
import AggregateError from './';

test(t => {
	const err = new AggregateError([new Error('foo'), 'bar']);
	console.log(err);
	t.regex(err.message, /Error: foo\n {8}at /);
	t.regex(err.message, /Error: bar\n {8}at /);
	t.deepEqual(Array.from(err), [new Error('foo'), new Error('bar')]);
});
