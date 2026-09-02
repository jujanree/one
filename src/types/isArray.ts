/**
 * Returns whether `x` is an `Array`
 */
export const isArray = <Type = any>(x: any): x is Type[] => x instanceof Array
