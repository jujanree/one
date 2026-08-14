import test, { suite } from "node:test"
import assert from "node:assert"

import { string } from "../../../dist/main.js"
import { same } from "../../../dist/src/array/array.js"
const {
	capitalize,
	extract,
	count,
	limit,
	concat,
	cover,
	isEmpty,
	multiSplit,
} = string

const {
	camelCase,
	PascalCase,
	HttpCase,
	kebabcase,
	snake_case,
	TRAIN_CASE,
	MACRO_CASE,
	flatcase,
} = string.id

suite("string", () => {
	test("capitalize", () => {
		assert.strictEqual(capitalize(), "")
		assert.strictEqual(capitalize("oUT oF Order"), "Out of order")
		assert.strictEqual(capitalize("OUT OF ORDER"), "Out of order")
	})

	test("extract", () => {
		assert.strictEqual(
			extract("iamanemail@gmail.com", /@.*\.com/g, ".online"),
			"iamanemail.online",
		)
		assert.strictEqual(
			extract(
				"Michael Ellis? Who on Earth is Michael Ellis?!",
				"Ellis",
				"Johnson",
			),
			"Michael Johnson? Who on Earth is Michael Johnson?!",
		)
	})

	test("count", () =>
		assert.strictEqual(
			count("John McDougal, John Doggett, John the Crow", "John"),
			3,
		))

	test("limit", () =>
		assert.strictEqual(
			limit(25, "... Boo!")("And there I sat, drinking tea"),
			"And there I sat, drinking... Boo!",
		))

	test("concat", () =>
		assert.strictEqual(
			concat("Xenomorph", "Yves", "Zeus"),
			"XenomorphYvesZeus",
		))

	test("cover", () =>
		assert.strictEqual(cover("911", "4123", "Brooklyn", "Square"), "9113klyn"))

	test("isEmpty", () => {
		assert(isEmpty(""))
		assert(!isEmpty("Bark"))
	})

	test("multiSplit", () => {
		const origStr =
			"Rough, angry pillow\nflew\n out through the \t old, battered \n window"

		const expStrs = [
			"Rough",
			"",
			"angry",
			"pillow",
			"flew",
			"",
			"out",
			"through",
			"the",
			"",
			"",
			"old",
			"",
			"battered",
			"",
			"",
			"window",
		]

		assert(same(multiSplit(origStr, ["\n", "\t", " ", ","]), expStrs))
	})

	suite("id", () => {
		test("camelCase", () => {
			assert.strictEqual(camelCase("this", "is", "it"), "thisIsIt")
			assert.strictEqual(camelCase("OnE", "Two", "THREE"), "oneTwoThree")
			assert.strictEqual(camelCase("somethingsome"), "somethingsome")
		})

		test("PascalCase", () => {
			assert.strictEqual(PascalCase("this", "is", "it"), "ThisIsIt")
			assert.strictEqual(PascalCase("OnE", "Two", "THREE"), "OneTwoThree")
			assert.strictEqual(PascalCase("somethingsome"), "Somethingsome")
		})

		test("Http-Case", () => {
			assert.strictEqual(HttpCase("this", "is", "it"), "This-Is-It")
			assert.strictEqual(HttpCase("OnE", "Two", "THREE"), "One-Two-Three")
			assert.strictEqual(HttpCase("somethingsome"), "Somethingsome")
		})

		test("kebab-case", () => {
			assert.strictEqual(kebabcase("this", "is", "it"), "this-is-it")
			assert.strictEqual(kebabcase("OnE", "Two", "THREE"), "one-two-three")
			assert.strictEqual(kebabcase("somethingsome"), "somethingsome")
		})

		test("snake_case", () => {
			assert.strictEqual(snake_case("this", "is", "it"), "this_is_it")
			assert.strictEqual(snake_case("OnE", "Two", "THREE"), "one_two_three")
			assert.strictEqual(snake_case("somethingsome"), "somethingsome")
		})

		test("TRAIN-CASE", () => {
			assert.strictEqual(TRAIN_CASE("this", "is", "it"), "THIS-IS-IT")
			assert.strictEqual(TRAIN_CASE("OnE", "Two", "THREE"), "ONE-TWO-THREE")
			assert.strictEqual(TRAIN_CASE("somethingsome"), "SOMETHINGSOME")
		})

		test("MACRO_CASE", () => {
			assert.strictEqual(MACRO_CASE("this", "is", "it"), "THIS_IS_IT")
			assert.strictEqual(MACRO_CASE("OnE", "Two", "THREE"), "ONE_TWO_THREE")
			assert.strictEqual(MACRO_CASE("somethingsome"), "SOMETHINGSOME")
		})

		test("flatcase", () => {
			assert.strictEqual(flatcase("this", "is", "it"), "thisisit")
			assert.strictEqual(flatcase("OnE", "Two", "THREE"), "onetwothree")
			assert.strictEqual(flatcase("somethingsome"), "somethingsome")
		})
	})
})
