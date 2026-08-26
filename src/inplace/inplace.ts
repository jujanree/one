/**
 * Sets the `array[i]` to be `mutation(array[i], i, array)`
 * for each `0 <= i < array.length`.
 *
 * Note: it changes the type of `array` to `Out[]`,
 * potentially invalidating types of previous references.
 *
 * @returns `array`
 */
export function mutate<T = any, Out = any>(
	array: T[],
	mutation: (x?: T, i?: number, arr?: T[]) => Out,
): Out[] {
	let i = array.length
	while (i--) array[i] = mutation(array[i], i, array) as any
	return array as unknown as Out[]
}

/**
 * Inserts all of `values` into `array` starting at `index`.
 *
 * @returns `array`
 */
export const insert = <T = any>(array: T[], index: number, values: T[]) => {
	array.splice(index, 0, ...values)
	return array
}

/**
 * Deletes `count` items from `array` starting at `index`.
 *
 * @returns `array`
 */
export const out = <T = any>(array: T[], index: number, count: number = 1) => {
	array.splice(index, count)
	return array
}

/**
 * Deletes `count` items from the end of `array`.
 *
 * @returns `array`
 */
export const lastOut = <T = any>(array: T[], count = 1) => {
	array.length -= count
	return array
}

/**
 * Deletes `count` items from the beginning of `array`.
 *
 * @returns `array`
 */
export const firstOut = <T = any>(array: T[], count = 1) => out(array, 0, count)

/**
 * Swaps places items at indexes `i` and `j` in the `array`.
 *
 * @returns `array`
 */
export const swap = <T = any>(array: T[], i: number, j: number) => {
	const temp = array[i]
	array[i] = array[j]
	array[j] = temp
	return array
}

/**
 * Replaces the value in `array` with `values` starting at `index`.
 *
 * @returns `array`
 */
export const replace = <T = any>(array: T[], index: number, values: T[]) => {
	array.splice(index, 1, ...values)
	return array
}
