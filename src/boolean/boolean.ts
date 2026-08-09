import { constant } from "../functional/constant.js"

/**
 * Returns `!x`
 */
export const not = (x: any) => !x

/**
 * Returns `true`
 */
export const T = constant<true>(true)

/**
 * Returns `false`
 */
export const F = constant<false>(false)

/**
 * The functional version of `x === y`
 */
export const equals = (x: any, y: any) => x === y

/**
 * The curried version of `equals`
 */
export const eqcurry = (x: any) => (y: any) => equals(x, y)

/**
 * Returns `x <= y`
 */
export const leq = <T = any>(x: T, y: T) => x <= y

/**
 * Returns `x >= y`
 */
export const geq = <T = any>(x: T, y: T) => x >= y

/**
 * Returns `x > y`
 */
export const gt = <T = any>(x: T, y: T) => x > y

/**
 * Returns `x < y`
 */
export const lt = <T = any>(x: T, y: T) => x < y
