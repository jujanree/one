/**
 * Sums all the given numbers and returns the result
 */
export const sum = (...numbers: number[]) =>
	numbers.reduce((last, curr) => last + curr, 0)

/**
 * Returns the product of all the given numbers
 */
export const product = (...numbers: number[]) =>
	numbers.reduce((last, curr) => last * curr, 1)

/**
 * Returns the minimum value of the given numbers
 */
export const min = Math.min

/**
 * Returns the maximum value of the given numbers
 */
export const max = Math.max

/**
 * @returns whether the given number is even
 */
export const isEven = (x: number) => x % 2 === 0

/**
 * @returns whether the given number is odd
 */
export const isOdd = (x: number) => x % 2 === 1

/**
 * Using the given number `x`, constructs and returns a new number guaranteed to be odd - `2 * x + 1`
 */
export const makeOdd = (x: number) => 2 * x + 1

/**
 * Using the given number `x`, constructs and returns a new number guaranteed to be even - "2 * x"
 */
export const makeEven = (x: number) => 2 * x

/**
 * Returns difference of `a` (defaults to 0) with sum of `b`
 */
export const difference = (a: number = 0, ...b: number[]) => a - sum(...b)

export const isPositive = (x: number) => x > 0

export const isNegative = (x: number) => x < 0

export const isZero = (x: number) => x === 0
