import { Pair } from "../array/array.js"

/**
 * Returns the pair of arrays of keys and values of the given `Map`
 */
export const kv = (map: Map<any, any>): Pair<readonly any[]> => [
	Array.from(map.keys()),
	Array.from(map.values()),
]

/**
 * Returns the new `Map` built from the key-value pairs passed
 */
export const dekv = ([keys, values]: Pair<readonly any[]>): Map<any, any> => {
	const map = new Map()
	for (let i = 0; i < keys.length; ++i) map.set(keys[i], values[i])
	return map
}
