import assert from "assert"
import test, { suite } from "node:test"
import { array, testing } from "../../../dist/main.js"

const { Range, assertThrows } = testing

type Range = testing.Range

class RangeTests {
	assertContents(expected: number[]) {
		assert(array.same([...this.range], expected))
	}

	assertBounds(from: number, to: number, step: number) {
		assert.strictEqual(this.range.from, from)
		assert.strictEqual(this.range.to, to)
		assert.strictEqual(this.range.step, step)
	}

	constructor(private readonly range: Range) {}
}

suite("testing", () => {
	suite("Range", () => {
		test("1-param", () => {
			const range = new Range(10)
			const tests = new RangeTests(range)
			tests.assertContents([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
			tests.assertBounds(0, 10, 1)
		})

		test("2-params", () => {
			const range = new Range(3, 9)
			const tests = new RangeTests(range)
			tests.assertContents([3, 4, 5, 6, 7, 8])
			tests.assertBounds(3, 9, 1)
		})

		test("3-params [positive step]", () => {
			const range = new Range(4, 10, 2)
			const tests = new RangeTests(range)
			tests.assertContents([4, 6, 8])
			tests.assertBounds(4, 10, 2)
		})

		test("3-params [negative step]", () => {
			const range = new Range(0, -5, -1)
			const tests = new RangeTests(range)
			tests.assertContents([0, -1, -2, -3, -4])
			tests.assertBounds(0, -5, -1)
		})

		test("failure to initialize (step = 0)", () => {
			assertThrows(() => new Range(1, 5, 0))
		})

		test("failure to initialize (step > 0, from > to)", () => {
			assertThrows(() => new Range(10, 5, 1))
		})

		test("failure to initialize (step < 0, from < to)", () => {
			assertThrows(() => new Range(5, 10, -1))
		})
	})
})
