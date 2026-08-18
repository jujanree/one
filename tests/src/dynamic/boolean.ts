import test, { suite } from "node:test"
import assert from "node:assert"

import { boolean } from "../../../dist/main.js"
const { not, T, F, equals, eqcurry, leq, lt, geq, gt } = boolean

suite("boolean", () => {
	test("not", () => assert(not(false)))
	test("T", () => assert.strictEqual(T(), true))
	test("F", () => assert.strictEqual(F(), false))

	test("equals", () => {
		assert(equals(3, 3))
		assert(!equals({}, {}))
		assert(!equals(true, false))
		assert(!equals(null, undefined))
	})

	test("eqcurry", () => {
		assert(eqcurry(3)(3))
		assert(!eqcurry({})({}))
		assert(!eqcurry(true)(false))
		assert(!eqcurry(null)(undefined))
	})

	test("leq", () => {
		assert(leq(3, 5))
		assert(leq(5, 5))
		assert(!leq(6, 5))
	})

	test("lt", () => {
		assert(lt(3, 5))
		assert(!lt(5, 5))
		assert(!lt(6, 5))
	})

	test("geq", () => {
		assert(!geq(3, 5))
		assert(geq(5, 5))
		assert(geq(6, 5))
	})

	test("gt", () => {
		assert(!gt(3, 5))
		assert(!gt(5, 5))
		assert(gt(6, 5))
	})
})
