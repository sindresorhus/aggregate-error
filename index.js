'use strict';
const indentString = require('indent-string');
const cleanStack = require('clean-stack');

const cleanInternalStack = stack => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, '');

class AggregateError extends Error {
	constructor(errors, options) {
		if (!Array.isArray(errors)) {
			throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
		}

		const flatten = options && Boolean(options.flatten);

		function * transformErrors(errors) {
			for (const error of errors) {
				if (flatten && error instanceof AggregateError) {
					yield * transformErrors(error);
				} else if (error instanceof Error) {
					yield error;
				} else if (error !== null && typeof error === 'object') {
					// Handle plain error objects with message property and/or possibly other metadata
					yield Object.assign(new Error(error.message), error);
				} else {
					yield new Error(error);
				}
			}
		}

		errors = [...transformErrors(errors)];

		let message = errors
			.map(error => {
				// The `stack` property is not standardized, so we can't assume it exists
				return typeof error.stack === 'string' ? cleanInternalStack(cleanStack(error.stack)) : String(error);
			})
			.join('\n');
		message = '\n' + indentString(message, 4);
		super(message);

		this.name = 'AggregateError';

		Object.defineProperty(this, '_errors', {value: errors});
	}

	* [Symbol.iterator]() {
		for (const error of this._errors) {
			yield error;
		}
	}
}

module.exports = AggregateError;
