import assert from "assert"
import { not } from "../boolean/boolean.js"
import { structCheck } from "../object/main.js"
import { isEmpty } from "../string/string.js"

/**
 * A type for representing a class
 * (can be a Function, provided it's created with `types.makeConstructor`)
 */
export type Constructor<
	T extends object = any,
	Args extends any[] = any[],
> = (new (...args: Args) => T) & { prototype: T }

export type AbstractConstructor<
	T extends object = any,
	Args extends any[] = any[],
> = (abstract new (...args: Args) => T) & { prototype: T }

export type FunctionConstructor<
	T extends object = any,
	Args extends any[] = any[],
> = (this: T, ...args: Args) => T | void

/**
 * Type for signifying one-variable type predicates
 */
export type TypePredicate<Type = any> = (x?: any) => x is Type

/**
 * A type of all the items `x`, such that `!x` is truthy
 */
export type Falsy = false | 0 | "" | null | undefined

/**
 * Returns whether a given `x` is a number primitive
 */
export const isNumber = (x: any): x is number => typeof x === "number"

/**
 * Returns whether `x` is a function
 */
export const isFunction = <T extends Function = Function>(x: any): x is T =>
	typeof x === "function"

/**
 * Returns whether `x` is a string primitive
 */
export const isString = (x: any): x is string => typeof x === "string"

/**
 * Returns whether `x` is a boolean primitive
 */
export const isBoolean = (x: any): x is boolean => typeof x === "boolean"

/**
 * Returns whether `x` is a symbol primitive
 */
export const isSymbol = (x: any): x is symbol => typeof x === "symbol"

/**
 * Returns whether `x` is an object
 */
export const isObject = <Type extends object = object>(x: any): x is Type =>
	typeof x === "object"

/**
 * Returns whether `x` is `null`
 */
export const isNull = (x: any): x is null => x === null

/**
 * Returns whether `x` is `undefined`
 */
export const isUndefined = (x: any): x is undefined => x === undefined

/**
 * Returns whether `x == null`
 */
export const isNullary = (x: any): x is undefined | null => x == null

/**
 * Returns `typeof x`
 */
export const typeOf = (x: any) => typeof x

/**
 * Returns whether `x` is an `Array`
 */
export const isArray = <Type = any>(x: any): x is Type[] => x instanceof Array

/**
 * Returns whether `x` is a `Set`
 */
export const isSet = <Type = any>(x: any): x is Set<Type> => x instanceof Set

/**
 * Returns whether `x` is a `Map`
 */
export const isMap = <K = any, V = any>(x: any): x is Map<K, V> =>
	x instanceof Map

/**
 * Returns a bool indicating whether it is possible to call `Number(x)` without:
 *
 * 1. getting `NaN`
 * 2. getting an error (this happens if `x` is a symbol)
 * 3. `x` being an empty string
 */
export function isNumberConvertible(x: any): boolean {
	return (
		(isNumber(x) && !isNaN(x)) ||
		(isString(x) && !isNaN(Number(x)) && !isEmpty(x)) ||
		isBoolean(x) ||
		isNull(x)
	)
}

/**
 * Returns whether `x` is a truthy value
 */
export const isTruthy = (x: any) => !!x

/**
 * Checks whether the given `x` is `Falsy`
 */
export const isFalsy = not as (x: any) => x is Falsy

/**
 * Returns either `x` if it's a non-`null` object, or `false`, if it isn't
 */
export const isStruct = (x: any) => isObject(x) && x

export const isIterable = structCheck<Iterable<any>>({
	[Symbol.iterator]: isFunction,
})

function verifyPrototypePresence<
	T extends object = any,
	Args extends any[] = any[],
>(constructorMaker: () => FunctionConstructor<T, Args>) {
	const constructor = constructorMaker()
	assert(constructor.prototype)
	return constructor
}

export function verifyConstructor<
	T extends object = any,
	Args extends any[] = any[],
>(constructorMaker: () => FunctionConstructor<T, Args>): Constructor<T, Args> {
	return verifyPrototypePresence(constructorMaker) as any // we don't actually know `new`-calls are valid
}

export function verifyAbstractConstructor<
	T extends object = any,
	Args extends any[] = any[],
>(
	constructorMaker: () => FunctionConstructor<T, Args>,
): AbstractConstructor<T, Args> {
	return verifyPrototypePresence(constructorMaker) as any
}
