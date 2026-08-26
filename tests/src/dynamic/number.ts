import test, { suite } from "node:test"
import assert from "node:assert"

import { number } from "../../../dist/main.js"

const {
	sum,
	product,
	min,
	max,
	isEven,
	isNegative,
	isOdd,
	isPositive,
	isZero,
	mod,
	makeOdd,
	makeEven,
	difference,
} = number

suite("number", () => {
	test("sum", () => {
		assert.strictEqual(sum(1, 2, 3), 6)
		assert.strictEqual(sum(1, 2, 3, 4, 5, 6), 21)
		assert.strictEqual(sum(), 0)
	})

	test("product", () => {
		assert.strictEqual(product(3, 7), 21)
		assert.strictEqual(product(Infinity, 1, 2, 3, 4), Infinity)
		assert.strictEqual(product(), 1)
	})

	test("min", () => {
		assert.strictEqual(min(3, 16, -2, 199), -2)
		assert.strictEqual(min(1, 2), 1)
	})

	test("max", () => {
		assert.strictEqual(max(20, 40, 1), 40)
		assert.strictEqual(max(Infinity, 3), Infinity)
	})

	test("isEven", () => {
		assert(isEven(2))
		assert(!isEven(1))
		assert(isEven(-2))
		assert(!isEven(-3))
		assert(isEven(0))
	})

	test("isOdd", () => {
		assert(!isOdd(2))
		assert(isOdd(1))
		assert(!isOdd(-2))
		assert(isOdd(-3))
		assert(!isOdd(0))
	})

	test("isZero", () => {
		assert(isZero(0))
		assert(!isZero(-1))
		assert(!isZero(1))
	})

	test("isNegative", () => {
		assert(isNegative(-1))
		assert(!isNegative(0))
		assert(!isNegative(1))
	})

	test("isPositive", () => {
		assert(!isPositive(-1))
		assert(!isPositive(0))
		assert(isPositive(1))
	})

	suite("mod", () => {
		test("x > 0", () => {
			assert.strictEqual(mod(4, 2), 0)
			assert.strictEqual(mod(4, -5), 4)
			assert.strictEqual(mod(3, 2), 1)
			assert.strictEqual(mod(2, 2), 0)
			assert.strictEqual(mod(15, 6), 3)
			assert.strictEqual(mod(10, 1), 0)
		})

		test("x < 0", () => {
			assert.strictEqual(mod(-3, 2), 1)
			assert.strictEqual(mod(-5, -3), 1)
			assert.strictEqual(mod(-5, 3), 1)
			assert.strictEqual(mod(-2, -2), 0)
			assert.strictEqual(mod(-15, -6), 3)
			assert.strictEqual(mod(-10, 1), 0)
		})

		test("x = 0", () => {
			assert.strictEqual(mod(0, 5), 0)
			assert.strictEqual(mod(0, 1), 0)
			assert.strictEqual(mod(0, -10), 0)
		})
	})

	test("makeEven", () => {
		assert.strictEqual(makeEven(5), 10)
		assert.strictEqual(makeEven(6), 12)
		assert.strictEqual(makeEven(-1), -2)
		assert.strictEqual(makeEven(0), 0)
	})

	test("makeOdd", () => {
		assert.strictEqual(makeOdd(5), 11)
		assert.strictEqual(makeOdd(6), 13)
		assert.strictEqual(makeOdd(-1), -1)
		assert.strictEqual(makeOdd(0), 1)
	})

	test("difference", () => {
		assert.strictEqual(difference(10, 2, 3, 4, 5), -4)
		assert.strictEqual(difference(-11, -3, -4, -5), 1)
		assert.strictEqual(difference(0, 1, 20, -9, -8, 5), -9)
	})
})
