import {test} from 'node:test';
import assert from 'node:assert/strict';
import AggregateError from './index.js';

test('handles a mix of errors, strings, and plain objects', () => {
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

	assert.match(error.message, /Error: foo\n {8}at /v);
	assert.match(error.message, /Error: bar\n {8}at /v);

	assert.deepEqual([...error.errors], [
		new Error('foo'),
		new Error('bar'),
		Object.assign(new Error('baz'), {code: 'EBAZ'}),
		Object.assign(new Error(), {code: 'EQUX'}), // eslint-disable-line unicorn/error-message
	]);
});

test('gracefully handle Error instances without a stack', () => {
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

	assert.match(error.message, /Error: foo\n {8}at /v);
	assert.match(error.message, /StacklessError: stackless/v);

	assert.deepEqual([...error.errors], [
		new Error('foo'),
		new StacklessError('stackless'),
	]);
});

test('gracefully handle Error instances with empty stack', () => {
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

	assert.match(error.message, /Error: foo\n {8}at /v);
	assert.match(error.message, /EmptyStackError: emptystack/v);

	assert.deepEqual([...error.errors], [
		new Error('foo'),
		new EmptyStackError('emptystack'),
	]);
});

test('strips internal aggregate-error frames from the message', () => {
	const error = new AggregateError([new Error('foo')]);

	assert.doesNotMatch(error.message, /aggregate-error\/index\.js/v);
});

test('handles pathological stack input in linear time', () => {
	// Guards against a super-linear regex in the internal stack cleaner.
	const error = new Error(' at '.repeat(200_000));

	const start = performance.now();
	// eslint-disable-next-line no-new
	new AggregateError([error]);
	assert.ok(performance.now() - start < 1000);
});
