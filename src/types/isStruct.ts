/**
 * Returns either `x` if it's a non-`null` object, or `false`, if it isn't
 */
export const isStruct = (x: any) => isObject(x) && x

/**
 * Returns whether `x` is an object (`null` included)
 */
export const isObject = <Type extends object = object>(x: any): x is Type =>
	typeof x === "object"
