/**
 * Returns `() => x`
 */
export const constant =
	<T = any>(x: T) =>
	() =>
		x
