import { Shape } from "../object/main.js"
import { isFunction } from "./isFunction.js"
import { isString } from "./isString.js"

const isIterableObject = new Shape.Builder<object & Iterable<any>>()
	.add(Symbol.iterator, isFunction)
	.build()
	.asPredicate()

/**
 * Returns whether a given entity is an iterable (either a
 * string or an object with a defined function-valued [Symbol.iterator])
 */
export const isIterable = <T = any>(x: any): x is Iterable<T> =>
	isString(x) || isIterableObject(x)
