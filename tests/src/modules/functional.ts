import assert from "node:assert"
import test, { suite } from "node:test"

import { same } from "../../../dist/src/array/array.js"
import { max, product, sum } from "../../../dist/src/number/number.js"
import { isNumber, isString } from "../../../dist/src/type/type.js"

import { functional } from "../../../dist/main.js"

const {
	or,
	id,
	and,
	trivialCompose,
	iterations,
	sequence,
	repeat,
	arrayCompose,
	cache,
	tupleSlice,
	tuplePick,
	constant,
	cached,
	copy,
	has,
	argWaster,
	argFiller,
} = functional

suite("functional", () => {
	test("or", () => {
		const isEveryNum = (...x: any[]) => x.every(isNumber)
		const or1 = or(isEveryNum, (...x: any[]) => x.every(isString))
		const or2 = or(isEveryNum, isString)
		const or3 = or(id)

		assert(or1())
		assert(or2())
		assert(!or3())

		assert(or1(3, 2, 1))
		assert(or1("3", "2", "1"))
		assert(!or1("3", "2", null))

		assert(or2(3, 2, 1))
		assert(!or2(3, "A", 1))
		assert(!or2(3, "A", "B"))
		assert(or2("C", "A", "B"))
		assert(or2("C", 2, 1))

		assert(!or3(false, false, false))
		assert.strictEqual(or3(null, false, false), null)
		assert.strictEqual(or3(false, false), false)
		assert(or3(true, false, false))
		assert(or3(true, true, true))
	})

	test("and", () => {
		const and1 = and(
			(...x: any[]) => x.some(isNumber),
			(...x: any[]) => x.some(isString),
		)

		const and2 = and(id)

		assert(!and1())
		assert(!and2())

		assert(and1(10, 90, "S", "R"))
		assert(!and1(10, 90))
		assert(!and1("S", "R"))

		assert(and2(10, true, "S"))
		assert(!and2(false))
		assert.strictEqual(and2(0), 0)
		assert.strictEqual(and2(10, 19, 44), 10)
	})

	test("trivialCompose", () => {
		assert.strictEqual(
			trivialCompose(
				(x: number) => x - 7,
				(x: number) => x ** 2,
				(...x: number[]) => max(...x) + 5,
			)(20, 11, -94),
			618,
		)
	})

	test("iterations", () => {
		const f = (i: number) => i ** 2
		const iter1 = iterations(f, 5)
		const iter2 = iterations(f, 10, 3)

		assert(same(iter1, [0, 1, 2, 3, 4].map(f)))
		assert(same(iter2, [0, 3, 6, 9].map(f)))
	})

	test("sequence", () =>
		assert(
			same(
				sequence((x: number) => 2 * x, 20)(1),
				[1].concat(
					Array(20)
						.fill(0)
						.map((_, i) => 2 ** (i + 1)),
				),
			),
		))

	test("repeat", () => {
		let i = 0
		repeat((j: number) => (i += j), 11)
		assert.strictEqual(i, 55)
	})

	test("arrayCompose", () => {
		const f = arrayCompose(
			(x: number, y: number, z: number) => (x + y + z) / 2,
			(x: number, y: number) => [x ** 2, x * y + 3, (x + y) ** 2],
			(x: number) => [x + 3, x ** 2],
		)

		assert.strictEqual(f(1), 24)
		assert.strictEqual(f(10), 7120.5)
	})

	test("cache", () => {
		const prequoted = cache(
			(quote: string) => (a: string) => `${quote}${a}`,
			["'", '"'],
		)

		assert.strictEqual(prequoted.get("'")!("stapleton"), "'stapleton")
		assert.strictEqual(prequoted.get('"')!("?"), '"?')
	})

	test("tupleSlice", () => {
		const f1 = (x: number, y = 3) => x + y
		const f2 = (x = 40, y = 90) => x * y
		const f3 = (x = 20, y = 40) => x / y

		const unsliced = tupleSlice(f1, f2, f3)

		const s1 = unsliced([0, 1], [1, 3], [3, 4])
		const s2 = unsliced([0, 2], [2, 2], [2, 4])
		const s3 = unsliced([0, 2], null, [0, 2])

		assert(same(s1(40, 20, 9, 90), [43, 180, 9 / 4]))
		assert(same(s2(9, 20, 3, 3), [29, 3600, 1]))
		assert(same(s2(19, -1, 3, 17), [18, 3600, 3 / 17]))
		assert(same(s3(7, 3), [10, 21, 7 / 3]))
	})

	test("tuplePick", () => {
		const f1 = sum
		const f2 = product

		const picked = tuplePick(f1, f2)

		const s1 = picked(null, (x) => x % 2 === 1)
		const s2 = picked(
			(x, i: number) => i < 3,
			(x, i: number) => x > 7 && i % 2 === 0,
		)

		assert(same(s1(1, 2, 3, 4, 5), [15, 15]))
		assert(same(s2(3, 5, 10, 9, 40), [18, 400]))
	})

	test("cached", () => {
		const cachedRoot = cached((x: number) => x ** (1 / 2))
		const cacheSize = 100000
		for (let i = 0; i < cacheSize; ++i) cachedRoot(i)
		assert.strictEqual(cachedRoot.cache.size, cacheSize)
	})

	test("constant", () => {
		assert.strictEqual(constant(5)(), 5)
		assert.strictEqual(constant(false)(), false)
		assert.strictEqual(constant("49")(), "49")
	})

	test("copy", () => {
		function F() {}
		function S() {
			if (this && this.r) {
				this.r += 13
				return this.r
			}
		}
		const T = { r: 329 }

		assert.notStrictEqual(copy(F), F)
		assert.strictEqual(copy(S, T)(), 342)
	})

	test("has", () => {
		const hasF = has(new Set(["2929", 13]))
		assert(!hasF(10))
		assert(!hasF(null))
		assert(hasF("2929"))
		assert(hasF(13))
	})

	test("argWaster", () => {
		function F(f = 32) {
			return f + 3
		}

		function S(a = 29, b = 11, c = 23) {
			return a * b + c ** 2
		}

		assert.strictEqual(argWaster()(F)(5), 35)
		assert.strictEqual(argWaster()(S)(5, 2, 3), 848)
		assert.strictEqual(argWaster(2)(S)(5, 2, 3), 584)
		assert.strictEqual(argWaster(1)(S)(5, 2, 3), 539)
		assert.strictEqual(argWaster(0)(S)(5, 2, 3), 19)
	})

	test("argFiller", () => {
		function S(a: number, b: number, c: number) {
			return a * (b + c) ** 2
		}

		const filler = argFiller(S)(0, 2)(11, 3)

		assert.strictEqual(filler(4), 539)
		assert.strictEqual(filler(6), 891)
	})
})
