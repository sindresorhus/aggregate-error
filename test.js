import test from 'ava';
import AggregateError from './index.js';

test('main', t => {
	const error = new AggregateError([
		new Error('foo'),
		'bar',
		{
			message: 'baz',
			code: 'EBAZ',
		},
		{
			code: 'EQUX',
		},
	]);

	console.log(error);

	t.regex(error.message, /Error: foo\n {8}at /);
	t.regex(error.message, /Error: bar\n {8}at /);

	t.deepEqual([...error.errors], [
		new Error('foo'),
		new Error('bar'),
		Object.assign(new Error('baz'), {code: 'EBAZ'}),
		Object.assign(new Error(), {code: 'EQUX'}), // eslint-disable-line unicorn/error-message
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
		new StacklessError('stackless'),
	]);

	console.log(error);

	t.regex(error.message, /Error: foo\n {8}at /);
	t.regex(error.message, /StacklessError: stackless/);

	t.deepEqual([...error.errors], [
		new Error('foo'),
		new StacklessError('stackless'),
	]);
});

test('gracefully handle Error instances with empty stack', t => {
	class EmptyStackError extends Error {
		constructor(...args) {
			super(...args);
			this.name = this.constructor.name;
			this.stack = '';
		}
	}

	const error = new AggregateError([
		new Error('foo'),
		new EmptyStackError('emptystack'),
	]);

	console.log(error);

	t.regex(error.message, /Error: foo\n {8}at /);
	t.regex(error.message, /EmptyStackError: emptystack/);

	t.deepEqual([...error.errors], [
		new Error('foo'),
		new EmptyStackError('emptystack'),
	]);
});

test('strips internal aggregate-error frames from the message', t => {
	const error = new AggregateError([new Error('foo')]);

	t.notRegex(error.message, /aggregate-error\/index\.js/);
});

test('handles pathological stack input in linear time', t => {
	// Guards against a super-linear regex in the internal stack cleaner.
	const error = new Error(' at '.repeat(200_000));

	const start = performance.now();
	new AggregateError([error]); // eslint-disable-line no-new
	t.true(performance.now() - start < 1000);
});
