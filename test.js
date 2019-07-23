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

test('understands non-array iterables', t => {
	function * generateErrors() {
		yield new Error('first error');
		yield new Error('second error');
		yield new Error('third error');
	}

	const error = new AggregateError(generateErrors());

	console.log(error);

	const errors = [...error];
	t.is(errors.length, 3);
	errors.forEach(e => t.truthy(e instanceof Error));
	t.is(errors[0].message, 'first error');
	t.is(errors[1].message, 'second error');
	t.is(errors[2].message, 'third error');
});
