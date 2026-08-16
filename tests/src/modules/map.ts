import test, { suite } from "node:test"
import assert from "node:assert"

import { map } from "../../../dist/main.js"
import { same as array_same } from "../../../dist/src/array/array.js"
import { same as object_same } from "../../../dist/src/object/main.js"

const { kv, dekv, toObject, keys, values } = map

const getMap = () =>
	new Map<any, any>([
		["R", 20],
		[true, "14"],
		[349, "score"]
	])

const objectMap = () =>
	new Map<string, any>([
		["R", 20],
		["S", 29],
		["K", true]
	])

const getObject = () => ({ R: 20, S: 29, K: true })

suite("map", () => {
	test("kv", () => {
		const _map = getMap()
		const [keys, values] = kv(_map)

		assert(array_same(keys, ["R", true, 349]))
		assert(array_same(values, [20, "14", "score"]))
	})

	test("dekv", () => {
		const _map = getMap()
		const kv_pair = kv(_map)
		const _map1 = dekv(kv_pair)

		const [keys, values] = kv_pair
		const [keys1, values1] = kv(_map1)

		assert(array_same(keys1, keys))
		assert(array_same(values, values1))
	})

	test("toObject", () => assert(object_same(toObject(objectMap()), getObject())))

	test("keys", () => { 
		const _map = getMap()
		const keysOrig = _map.keys()
		const keys1 = keys(_map)
		assert(array_same(keysOrig, keys1))
	})
	
	test("values", () => { 
		const _map = getMap()
		const valuesOrig = _map.values()
		const values1 = values(_map)
		assert(array_same(valuesOrig, values1))
	})
})
