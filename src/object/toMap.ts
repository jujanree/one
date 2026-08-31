import { trivialCompose } from "../functional/functional.js"
import { dekv as mdekv } from "../map/map.js"
import { kv, ObjectKey } from "./main.js"

/**
 * Converts an `object` to a map
 */
export const toMap = trivialCompose(mdekv, kv) as (
	x: object,
) => Map<ObjectKey, any>
