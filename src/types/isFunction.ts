import type { AnyFunction } from "./types.js"

/**
 * Returns whether `x` is a function
 */
export const isFunction = <T extends AnyFunction = AnyFunction>(
	x: any,
): x is T => typeof x === "function"
