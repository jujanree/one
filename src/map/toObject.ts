import { trivialCompose } from "../functional/functional.js"
import { dekv, ObjectKey } from "../object/object.js"
import { kv } from "./main.js"

/**
 * Converts a given `Map` into an `object`
 */
export const toObject = trivialCompose(dekv, kv) as <T = any>(
	x: Map<string, T>,
) => Record<ObjectKey, T>
