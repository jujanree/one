import assert from "node:assert"
import { isNumber } from "../types/types.js"

/**
 * Asserts that `callback` exits via throwing (an exception)
 */
export function assertThrows(callback: () => void) {
	let failed = false

	try {
		callback()
		failed = true
	} catch {}

	assert(!failed)
}

/**
 * Asserts that `a` is strictly greater than `b`
 */
export function assertGreaterThan<T = any>(a: T, b: T) {
	assert(a > b)
}

/**
 * Asserts that `a` is strictly less than `b`
 */
export function assertLessThan<T = any>(a: T, b: T) {
	assert(a < b)
}

/**
 * Asserts that `pred` is fulfilled for all the `x: T` of `iter`,
 * with `i: number` parameter being the index of current `x` and
 * `iter` itself being available inside the body of `pred` via the
 * third argument.
 */
export function assertForEach<T, X extends Iterable<T>>(
	iter: X,
	pred: (x: T, i: number, iter: X) => boolean,
) {
	let i = 0
	for (const x of iter) assert(pred(x, i++, iter))
}

/**
 * A guaranteedly finite `Iterable<number>` object with user-provided boundaries.
 *
 * @class
 * @constructor
 * @public
 *
 * @param {number} from The starting value for the range (inclusive). If `to` is not provided, `this.to` becomes the provided `from` and `this.from` becomes `0`.
 * @param {number} to The endpoint of the range (exclusive). Provide this argument either if you need a non-`0` `this.from` value, or a non-`1` `this.step` value.
 * @param {number} step The step of the range - the constant increment for obtaining new values. Default: `1`
 */
export class Range {
	/**
	 * The end boundary of the range (exclusive).
	 */
	declare readonly to: number

	/**
	 * The starting point of the range (inclusive).
	 */
	declare readonly from: number

	declare private readonly limit: (i: number, lim: number) => boolean

	private static less = (i: number, lim: number) => i < lim
	private static greater = (i: number, lim: number) => i > lim

	private isWithin(i: number) {
		return this.limit(i, this.to)
	}

	*[Symbol.iterator]() {
		for (let i = this.from; this.isWithin(i); i += this.step) yield i
	}

	constructor(
		from: number,
		to?: number,
		/**
		 * The iteration step - a constant value, by which the current range
		 * value is incremented to produce the one immediately after.
		 */
		readonly step: number = 1,
	) {
		assert.notStrictEqual(step, 0)

		if (!isNumber(to)) {
			to = from
			from = 0
		}

		this.from = from
		this.to = to
		this.limit = this.step > 0 ? Range.less : Range.greater

		// against infinite loops
		assert(this.isWithin(this.from))
	}
}
