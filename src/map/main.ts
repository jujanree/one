/**
 * Returns the pair of arrays of keys and values of the given `Map`
 */
export const kv = <K = any, V = any>(
	map: Map<K, V>,
): [readonly K[], readonly V[]] => [keys(map), values(map)]

/**
 * Returns the new `Map` built from the key-value pairs passed
 */
export const dekv = <K = any, V = any>([keys, values]: [
	readonly K[],
	readonly V[],
]): Map<any, any> => {
	const map = new Map<K, V>()
	for (let i = 0; i < keys.length; ++i) map.set(keys[i], values[i])
	return map
}

export const keys = <K = any, V = any>(map: Map<K, V>) => Array.from(map.keys())

export const values = <K = any, V = any>(map: Map<K, V>) =>
	Array.from(map.values())
