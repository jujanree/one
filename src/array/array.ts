import assert from "assert"
import { equals } from "../boolean/boolean.js"
import { constant } from "../functional/constant.js"
import { isArray } from "../types/types.js"

export type Pair<A = any, B = A> = [A, B]
export type Pairs<A = any, B = A> = Pair<A, B>[]

/**
 * A generic type for representation of N-tuples with the same type.
 *
 * Creates a type of `[Type, ...]` (`LowLim` items) `| [Type, ...]` (`LowLim + 1` items) `| ... | [Type, ...]` (`UpLim` items).
 *
 * Example:
 *
 * `type Z = Tuple<number, 0, 3>`
 *
 * `type O = Tuple<string, 4>`
 *
 * Are the same as:
 *
 * `type Z = [] | [number] | [number, number] | [number, number, number]`
 *
 * `type O = [string, string, string, string]`
 */
export type Tuple<
	Type,
	LowLim extends number,
	UpLim extends number = LowLim,
> = LowLim extends LowLim
	? number extends LowLim
		? Type[]
		: LowLim extends UpLim
			? _TupleOfBase<Type, LowLim, []>
			: _TupleOf<Type, Tuple<Type, LowLim>, Tuple<Type, UpLim>, []>
	: never

type _TupleOfBase<
	Type,
	Limit extends number,
	Rem extends unknown[],
> = Rem["length"] extends Limit
	? Rem
	: _TupleOfBase<Type, Limit, [...Rem, Type]>

type _TupleOf<
	Type,
	LowLim extends unknown[],
	UpLim extends unknown[],
	Rem extends unknown[],
> = LowLim["length"] extends 0
	? [] | (UpLim["length"] extends 0 ? never : _TupleOf<Type, [Type], UpLim, []>)
	: Rem["length"] extends LowLim["length"]
		? Rem
		:
				| _TupleOf<Type, LowLim, UpLim, [...Rem, Type]>
				| (LowLim["length"] extends UpLim["length"]
						? never
						: _TupleOf<Type, [...LowLim, Type], UpLim, Rem>)

/**
 * Returns a predicate, that indicates that the argument `x` is a `Tuple`,
 * with `.length` being precisely `n`.
 */
export const isTuple =
	<Items extends number>(n: Items) =>
	<Type>(x: any): x is Tuple<Type, Items> =>
		isArray(x) && x.length === n

/**
 * A predicate, that determines if the given item is an array of length 2.
 */
export const isPair = isTuple(2) as <A = any, B = any>(
	x: any,
) => x is Pair<A, B>

/**
 * A function that creates a copy of the given array without the last `count` elements (default: `1`)
 */
export const lastOut = <Type = any>(x: readonly Type[], count = 1) =>
	x.slice(0, x.length - count)

/**
 * Returns the last element of `x`
 */
export const last = <Type = any>(x: readonly Type[]) => x[lastIndex(x)]

/**
 * Sets the last index of `x` to `v`.
 * @returns `v`
 */
export const setLast = <T = any>(x: T[], v: T) => (x[lastIndex(x)] = v)

/**
 * Sets the `.length` of `x` to `0`
 */
export const clear = <Type = any>(x: Type[]) => (x.length = 0)

/**
 * Creates a copy of the array with `values` inserted into it at `index`,
 * and `replaced(x)` items skipped immediately afterwards.
 */
export const insertion =
	(replaced: (x: readonly any[]) => number) =>
	<Type = any>(x: readonly Type[], index: number, values: Type[]) =>
		x
			.slice(0, index)
			.concat(values)
			.concat(x.slice(index + replaced(x)))

/**
 * Same as `insertion(constant(0))`. Creates a copy, which is a result of inserting items at a given index without any removal
 */
export const insert = insertion(constant(0))

/**
 * Same as `insertion(constant(1))`. Creates a copy, which is a result of inserting items at a given index, removing only a single item
 */
export const replace = insertion(constant(1))

/**
 * Creates a copy of `target`, which is a result of removal of `count` items at the given `index`
 * (default `count = 1`).
 */
export const without = <Type = any>(
	target: readonly Type[],
	index: number,
	count = 1,
) => target.slice(0, index).concat(target.slice(index + count))

/**
 * Creates a copy of a given array, with the first `count` items removed (by default - `1`)
 */
export const firstOut = <Type = any>(x: readonly Type[], count = 1) =>
	x.slice(count)

/**
 * Gets the first item of the array
 */
export const first = <Type = any>(x: readonly Type[]) => x[0]

/**
 * Creates a copy of the given array
 */
export const copy = <Type = any>(x: readonly Type[]) => x.slice()

/**
 * Allocates and returns a new empty array.
 */
export const empty = (): [] => []

/**
 * Compares two iterables `a` and `b`
 * by converting them to arrays and using
 * element-by-element `pred(a[i], b[i], i)`.
 *
 * For comparison to yield `true`, it is required for both arrays to have the same length.
 *
 * `pred` defaults to `(x, y) => x === y`
 */
export const same = <T = any>(
	a: Iterable<T>,
	b: Iterable<T>,
	pred: (x: T, y: T, i: number) => boolean = equals,
) => {
	let i = 0
	const bIter = b[Symbol.iterator]()

	for (const aCurr of a) {
		const bCurr = bIter.next()
		if (bCurr.done) return false
		if (!pred(aCurr, bCurr.value, i++)) return false
	}

	return !!bIter.next().done
}

/**
 * Creates the array consisting of all the unique items of the given
 * Iterable, in the order in which they appear
 */
export const unique = <T = any>(x: Iterable<T>) => Array.from(new Set<T>(x))

/**
 * Returns either the first truthy element of `x`, or `last(x)`
 */
export const or = <T = any>(x: readonly T[]) => {
	for (const curr of x) if (curr) return curr
	return last(x)
}

/**
 * Returns either the first falsy element of `x` or `last(x)`
 */
export const and = <T = any>(x: readonly T[]) => {
	for (const curr of x) if (!curr) return curr
	return last(x)
}

/**
 * Creates a function returning new shallow copies of `array` [useful for factoring-out/remembering information about the array`s contents]
 */
export const allocator =
	<T = any>(array: readonly T[]) =>
	() =>
		copy(array)

/**
 * Returns the last index of a given array
 */
export const lastIndex = (array: readonly any[]) => array.length - 1

/**
 * Returns whether `array` is empty
 */
export const isEmpty = (array: readonly any[]) => array.length === 0

/**
 * Recursively verifies that `a` and `b` are "the same" in
 * terms of provided `pred` (i.e. it runs `pred(x, y, i)` on all
 * non-array elements and descends further with a new call of
 * `recursiveSame(x, y, pred)` otherwise).
 */
export const recursiveSame = <T = any>(
	a: readonly T[],
	b: readonly T[],
	pred: (x: T, y: T, i: number) => boolean = equals,
) =>
	a.length === b.length &&
	a.every((ax, i) =>
		isArray(ax) && isArray(b[i])
			? recursiveSame(ax, b[i], pred)
			: pred(a[i], b[i], i),
	)

/**
 * Sets `target[writeIndexes[i]]` to `values[i]` for every
 * available index (note: lengths of `values` and `writeIndexes`
 * must be equal).
 */
export const fill = <T = any>(
	target: T[],
	writeIndexes: readonly number[],
	values: readonly T[],
) => {
	assert.strictEqual(writeIndexes.length, values.length)
	const { length } = writeIndexes
	for (let i = 0; i < length; ++i) target[writeIndexes[i]] = values[i]
}

/**
 * Creates a function for partial filling of an array
 * determined by `indexes` (with `n` being the max fillable index)
 * and `values` (first part of the arguments out of two).
 *
 * The `remainder` is the rest of the arguments, yet unfilled.
 *
 * NOTE: arguments in `values` are indexed by `filledIndexes`,
 * similarly `remainder` is indexed by its complement.
 */
export const substitute = (n: number, indexes: readonly number[]) => {
	const filledIndexes = indexes.toSorted().filter((x) => x < n)
	const limIndexes = new Set(filledIndexes)
	return <T = any>(values: readonly T[]) => {
		const protoArr = Array<T>(n)
		fill(protoArr, filledIndexes, values)
		const restIndexes = Array.from(
			protoArr.keys().filter((x) => !limIndexes.has(x)),
		)
		return (remainder: readonly T[]) => {
			const complete = copy(protoArr)
			fill(complete, restIndexes, remainder)
			return complete
		}
	}
}

/**
 * Returns an array of keys of `x`
 */
export const keys = <T = any>(x: readonly T[]) => Array.from(x.keys())

/**
 * Returns an array of zeros of length n
 */
export const zeros = (n: number) => Array(n).fill(0)

/**
 * Returns an Array of numbers from `0` to `n - 1`
 */
export const numbers = (n: number) => zeros(n).map((_x, i) => i)

/**
 * Creates an array of given `length` with each element defined
 * by calls to `f(i)`, where `i` is the element index.
 */
export const from = <T = any>(length: number, f: (i: number) => T) =>
	Array.from({ length }, (_v, i) => f(i))

/**
 * Creates a new array that is the repetition of `source` `n` times.
 */
export const repeat = <T = any>(source: readonly T[], n: number) => {
	assert(n >= 0)
	if (n === 0) return []

	const origLen = source.length
	const newLen = origLen * n
	const repeated = Array<T>(newLen)
	for (let i = 0; i < newLen; ++i) repeated[i] = source[i % origLen]
	return repeated
}

export const difference = <T = any>(source: Iterable<T>, subset: Iterable<T>) =>
	Array.from(new Set(source).difference(new Set(subset)))
