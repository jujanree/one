/**
 * Returns whether `x` is a string primitive
 */
export const isString = (x: any): x is string => typeof x === "string"
