import test, { suite } from "node:test"
import assert from "node:assert"
import { copy, same } from "../../../dist/src/array/array.js"

import {
	insert as copying_insert,
	without as copying_out,
	lastOut as copying_lastOut,
	replace as copying_replace
} from "../../../dist/src/array/array.js"

import { inplace } from "../../../dist/main.js"
const { mutate, insert, out, lastOut, swap, replace } = inplace

const getArray = () => [1, 2, 3, 4]

suite("inplace", () => {
	test("mutate", () => {
		const square = (x: number) => x ** 2
		const array = getArray()
		const mapped = array.map(square)

		assert(same(mutate(array, square), mapped))
		assert(same(array, mapped))
	})

	test("insert", () => {
		const array = getArray() as any[]
		const oldlength = array.length
		assert(same(copying_insert(array, 2, "R", true), insert(array, 2, "R", true)))
		assert.strictEqual(array.length, oldlength + 2)
	})

	test("out", () => {
		const array = getArray()
		const oldlength = array.length
		assert(same(copying_out(array, 2, 2), out(array, 2, 2)))
		assert.strictEqual(array.length, oldlength - 2)
	})

	test("lastOut", () => {
		const array = getArray()
		const oldlength = array.length
		assert(same(copying_lastOut(array, 3), lastOut(array, 3)))
		assert.strictEqual(oldlength - 3, array.length)
	})

	test("swap", () => {
		const array = getArray()
		const copied = copy(array)

		const oldind = 1
		const newind = 3

		const oldval = array[oldind]
		const newval = array[newind]

		swap(array, oldind, newind)

		assert.strictEqual(array[oldind], newval)
		assert.strictEqual(array[newind], oldval)
		assert(!same(copied, array))

		assert(same(swap(array, oldind, newind), copied))
		assert(same(array, copied))
	})

	test("replace", () => {
		const array = getArray() as any[]
		const oldlength = array.length
		assert(
			same(
				copying_replace(array, 3, "S", "D", true),
				replace(array, 3, "S", "D", true)
			)
		)
		assert.strictEqual(oldlength + 2, array.length)
	})
})
