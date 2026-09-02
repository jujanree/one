import { last, lastOut, substitute } from "../array/array.js"
import { not } from "../boolean/boolean.js"
import { max } from "../number/number.js"
import {
	AnyFunction,
	ArrayMapper,
	BasicFunction,
	Falsy,
	Filter,
	isUndefined,
	MapReturnType,
} from "../types/types.js"

/**
 * Provided with a list of functions, lazily executes them in sequence
 * and returns the first truthy result.
 *
 * If all results are falsy - returns the last one
 */
export const or =
	<F extends (...args: any) => any>(...fs: F[]) =>
	(...x: Parameters<F>): false | ReturnType<F> =>
		fs.reduce((prev, curr) => (prev ? prev : curr(...x)), false)

/**
 * Provided with a list of functions, lazily executes them in sequence
 * and returns the first falsy result.
 *
 * If all results are truthy - returns the last one
 */
export const and =
	<F extends AnyFunction>(...fs: F[]) =>
	(...x: Parameters<F>): Falsy | ReturnType<F> =>
		fs.reduce((prev, curr) => (prev ? curr(...x) : prev), true)

/**
 * Returns function composition of `f`.
 *
 * The result is `(...args: Parameters<FL>): ReturnType<FF> => f[0](f[1](...(f[n - 1](...args))...))`
 */
export const compose =
	<FF extends BasicFunction, FL extends AnyFunction>(
		...f: [FF, ...AnyFunction[], FL]
	) =>
	(...x: Parameters<FL>): ReturnType<FF> => {
		const start: ReturnType<FL> = ((last(f) || id) as FL)(...x)
		return lastOut(f).reduceRight((last: any, curr: any) => curr(last), start)
	}

/**
 * Returns the array, with values of `arr[i] = j * i` for `0 <= i <= floor(n / j)`.
 *
 * Default `j` value is `1`.
 */
export const jumps = (n: number, j = 1) =>
	Array.from({ length: Math.floor(n / j) + +(j > 1) }, (_x, i) => j * i)

/**
 * Returns an array `X`, with `X[0] = init` and `X[i] = f(X[i - 1], i - 1, X)`
 * for `1 <= i <= n - 1`.
 */
export const sequence =
	<T = any>(f: (v: T, i: number, seq: T[]) => T, n: number) =>
	(init: T) => {
		const seq = [init]
		for (let i = 0; i < n; ++i) seq.push(f(seq[i], i, seq))
		return seq
	}

/**
 * Makes the calls `f(x_0), f(x_1), ..., f(x_{n - 1})`, where `x_i` is the `i`th element of `x`
 */
export const loopOver = <T = any>(f: (x: T) => void, x: Iterable<T>) => {
	for (const xCurr of x) f(xCurr)
}

/**
 * Returns a composition, such that expected output of any of the given functions
 * is an array intended to be spread out as input for the next function (i.e. one
 * closer to the beginning of the array).
 */
export const arrayCompose =
	<FF extends AnyFunction, FL extends ArrayMapper>(
		...fs: [FF, ...ArrayMapper[], FL]
	) =>
	(...x: Parameters<FL>): ReturnType<FF> => {
		return fs.reduceRight((last: any[], curr) => curr(...last), x)
	}

/**
 * Returns a `Map`, filled with key-value pairs of `[x, f(x, i, keys)]` for each `x` in `keys`
 */
export const toMap = <Key = any, Out = any>(
	f: (x: Key, i: number, keys: readonly Key[]) => Out,
	keys: readonly Key[],
): Map<Key, Out> => new Map(keys.map((x, i) => [x, f(x, i, keys)]))

/**
 * Breaks the given inputs' array `x` into (possibly intersecting) segments using `x.slice(ind[i])`,
 * then - calls the respective function `f[i]` with each segment, and returns all of the calls'
 * return values in an array.
 *
 * A missing `x.slice`-interval defaults to `[]` (whole signature copying)
 */
export const tupleSlice =
	<FunctionTuple extends AnyFunction[]>(...f: FunctionTuple) =>
	(...ind: ([number?, number?] | undefined | null)[]) =>
	(...x: any[]) =>
		f.map((fun, i) =>
			fun(...x.slice(...(ind[i] || []))),
		) as MapReturnType<FunctionTuple>

/**
 * Similar to `tupleSlice`, only difference being that `inds` are now predicates,
 * using which the signatures for each particular function are `x.filter(inds[i])`-ed
 */
export const tuplePick =
	<FunctionTuple extends AnyFunction[]>(...fs: FunctionTuple) =>
	<In extends any[] = any[]>(...ind: Filter[]) =>
	(...x: In) =>
		fs.map((f, i) => f(...x.filter(ind[i]))) as MapReturnType<FunctionTuple>

/**
 * Returns a function inputs of which are cached on each call in a `Map<K, V>`.
 */
export const cached = <K = any, V = any>(base: (x: K) => NonNullable<V>) => {
	const cache = new Map<K, V>()

	function toCache(x: K) {
		const cacheval = cache.get(x)
		if (!isUndefined(cacheval)) return cacheval
		const retval = base(x)
		cache.set(x, retval)
		return retval
	}

	return toCache
}

/**
 * Identity function
 */
export const id = <Type = any>(x: Type) => x

/**
 * No-op function
 */
export const nil = () => {}

/**
 * Returns a new function calling `f`, with arguments at positions defined by `indexes` Set
 * filled with `start`, and the remaining arguments filled with 'rest'.
 */
export const argFiller = (f: AnyFunction) => {
	return (...indexes: number[]) => {
		const substitutionForm = substitute(f.length, indexes)
		return (...start: any[]) => {
			const restPlugger = substitutionForm(start)
			return (...rest: any[]) => f(...restPlugger(rest))
		}
	}
}

/**
 * Returns `f.bind(bound)`
 */
export const bind = <F extends AnyFunction>(f: F, bound: any): F =>
	f.bind(bound)

/**
 * Returns a function returning `set.has(x)`
 */
export const has =
	<T = any>(set: Set<T>) =>
	(x: T) =>
		set.has(x)

/**
 * Returns a function removing the last `min(n, args.length)` arguments
 * and calls `f` on the result. Default `n` is `Infinity`.
 */
export const argWaster =
	(n: number = Infinity) =>
	<F extends AnyFunction = AnyFunction>(f: F) =>
	(...args: any[]): ReturnType<F> =>
		f(...args.slice(0, max(0, args.length - n)))

/**
 * Returns `(...x) => !f(...x)`
 */
export const negate = <F extends AnyFunction>(
	f: F,
): ((...args: Parameters<F>) => boolean) => compose(not, f)

export * from "./constant.js"
