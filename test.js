import test from 'ava';
import AggregateError from '.';

test('main', t => {
	const error = new AggregateError([
		new Error('foo'),
		'bar',
		{
			message: 'baz',
			code: 'EBAZ'
		},
		{
			code: 'EQUX'
		}
	]);

	console.log(error);

	t.regex(error.message, /Error: foo\n {8}at /);
	t.regex(error.message, /Error: bar\n {8}at /);

	t.deepEqual([...error], [
		new Error('foo'),
		new Error('bar'),
		Object.assign(new Error('baz'), {code: 'EBAZ'}),
		Object.assign(new Error(), {code: 'EQUX'})
	]);
});

test('gracefully handle Error instances without a stack', t => {
	class StacklessError extends Error {
		constructor(...args) {
			super(...args);
			this.name = this.constructor.name;
			delete this.stack;
		}
	}

	const error = new AggregateError([
		new Error('foo'),
		new StacklessError('stackless')
	]);

	console.log(error);

	t.regex(error.message, /Error: foo\n {8}at /);
	t.regex(error.message, /StacklessError: stackless/);

	t.deepEqual([...error], [
		new Error('foo'),
		new StacklessError('stackless')
	]);
});
