import assert from "assert"
import { equals } from "../boolean/boolean.js"
import { constant } from "../functional/constant.js"
import { difference } from "../number/number.js"
import { ownProperties } from "../object/main.js"
import { isArray, isNumberConvertible } from "../type/type.js"

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
 * Returns a predicate, purpose of which is to indicate that the argument `x` is a `Tuple`,
 * with `.length` being precisely `n`.
 */
export const isTuple =
	<Items extends number>(n: number) =>
	<Type>(x: any): x is Tuple<Type, Items> =>
		isArray(x) && x.length === n

/**
 * A predicate, purpose of which is to determine that the given item is an array of length 2.
 */
export const isPair = isTuple(2) as <A = any, B = any>(
	x: any,
) => x is Pair<A, B>

/**
 * A type-only no-op function, purpose of which is to treat the given arguments as an array of respective specific type.
 */
export const tuple = <T extends readonly any[]>(...args: T): T => args

/**
 * A function for creating a copy of the given array without the last `count` elements (by default - 1)
 */
export const lastOut = <Type = any>(x: readonly Type[], count = 1) =>
	x.slice(0, x.length - count)

/**
 * A function for obtaining the last element of the given array.
 */
export const last = <Type = any>(x: readonly Type[]) => x[lastIndex(x)]

/**
 * Sets the value of the last element of the array `x` to be `v`.
 * @returns `v`
 */
export const setLast = <T = any>(x: T[], v: T) => (x[lastIndex(x)] = v)

/**
 * A function for mutating the given array via setting its` `.length` to `0`.
 */
export const clear = <Type = any>(x: Type[]) => (x.length = 0)

/**
 * A function for creating a copy of the array with `values` inserted into it at `index`, and `replaceNum(x)` items skipped.
 */
export const insertion =
	(replaceNum: (x: readonly any[]) => number) =>
	<Type = any>(x: readonly Type[], index: number, ...values: Type[]) =>
		x
			.slice(0, index)
			.concat(values)
			.concat(x.slice(index + replaceNum(x)))

/**
 * Same as `insertion(constant(0))`. Creates a copy, which is a result of inserting items at a given index without any removal
 */
export const insert = insertion(constant(0))

/**
 * Same as `insertion(constant(1))`. Creates a copy, which is a result of inserting items at a given index, removing only a single item
 */
export const replace = insertion(constant(1))

/**
 * Creates a copy of a given array, which is a result of removal of `count` items from the given index (default - a single item);
 */
export const out = <Type = any>(
	array: readonly Type[],
	index: number,
	count = 1,
) => array.slice(0, index).concat(array.slice(index + count))

/**
 * Creates a copy of a given array, with the first `count` items removed (by default - 1)
 */
export const firstOut = <Type = any>(x: readonly Type[], count = 1) =>
	x.slice(count)

/**
 * Gets the first item of the array
 */
export const first = <Type = any>(x: readonly Type[]) => x[0]

/**
 * Calls `f` on `x`, assigning all the own keys on `x`, that are not in `excluded` to `x`.
 *
 * Useful for creating "hybrid" arrays from existing objects.
 */
export const propPreserve = (
	f: Function,
	excluded: readonly (string | symbol)[] = [],
) => {
	const excludedSet = new Set(excluded)
	return (x: object) => {
		const result = f(x)
		const [keys, values] = ownProperties(x)
		let i = keys.length
		while (i--) {
			const key = keys[i]
			if (!isNumberConvertible(key) && !excludedSet.has(key))
				result[key] = values[i]
		}
		return result
	}
}

/**
 * Creates a copy of the given array
 */
export const copy = <Type = any>(x: readonly Type[]) => ([] as Type[]).concat(x)

/**
 * Allocates and returns a new empty array.
 */
export const empty = (): [] => []

/**
 * Conducts the comparison of two iterables `a` and `b`
 * by converting them to arrays and using element-by-element `pred(a[i], b[i], i)`.
 *
 * For comparison to yield `true`, it is required for both arrays to have the same length.
 *
 * `pred` defaults to `(x, y) => x === y`
 */
export const same = (
	a: Iterable<any>,
	b: Iterable<any>,
	pred: (x?: any, y?: any, i?: any) => boolean = equals,
) => {
	const [aarr, barr] = [a, b].map((x) => Array.from(x))
	return (
		aarr.length === barr.length && aarr.every((x, i) => pred(x, barr[i], i))
	)
}

/**
 * Creates the array consisting of all the unique items of the given
 * Iterable, in the order in which they appear
 */
export const uniqueArr = <T = any>(x: Iterable<T>) => Array.from(new Set<T>(x))

/**
 * Returns either the first truthy element of `x`, or `last(x)`
 */
export const or = <T = any>(x: T[]) => {
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
 * @returns whether the given array is empty
 */
export const isEmpty = (array: readonly any[]) => !array.length

/**
 * Recursively applies `array.same(a[i], b[i], i)` for `a[i]` and `b[i]` - arrays,
 * to the given arrays `a` and `b` (otherwise, applying `pred(a[i], b[i], i)`),
 * and returns the result.
 */
export const recursiveSame = (
	a: readonly any[],
	b: readonly any[],
	pred: (x?: any, y?: any, i?: number) => boolean = equals,
) =>
	a.length === b.length &&
	a.every((ax, i) =>
		isArray(ax) && isArray(b[i])
			? recursiveSame(ax, b[i], pred)
			: pred(a[i], b[i], i),
	)

/**
 * Calls `array.sort(order)` with `order` defaulting to `number.difference`
 */
export const sort = <T = any>(
	array: T[],
	order: (a: any, b: any) => number = difference,
) => array.sort(order)

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
 * Creates a new function, which creates a new array of length `n`, indexes of which
 * defined by the `indexes` array (note: which is pre-ordered), are filled with `values`,
 * the remaining ones being filled by the values of the `x` array
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
 * Returns the array of keys for the given array `x`
 */
export const keys = <T = any>(x: readonly T[]) => Array.from(x.keys())

/**
 * Returns an Array of numbers from `0` to `n - 1`
 */
export const numbers = (n: number) =>
	Array(n)
		.fill(0)
		.map((_x, i) => i)

export const from = <T = any>(length: number, f: (i: number) => T) =>
	Array.from({ length: length }, (_v, i) => f(i))

export const repeat = <T = any>(source: readonly T[], times: number) => {
	assert(times >= 0)
	if (times === 0) return []

	const origLen = source.length
	const newLen = origLen * times
	const repeated = Array<T>(newLen)
	for (let i = 0; i < newLen; ++i) repeated[i] = source[i % origLen]
	return repeated
}
