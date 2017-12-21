import test from 'ava';
import AggregateError from './';

test(t => {
	const err = new AggregateError([
		new Error('foo'),
		'bar',
		{message: 'baz', code: 'EBAZ'},
		{code: 'EQUX'}
	]);
	console.log(err);
	t.regex(err.message, /Error: foo\n {8}at /);
	t.regex(err.message, /Error: bar\n {8}at /);
	t.deepEqual(Array.from(err), [
		new Error('foo'),
		new Error('bar'),
		Object.assign(new Error('baz'), {code: 'EBAZ'}),
		Object.assign(new Error(), {code: 'EQUX'})
	]);
});
