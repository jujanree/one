import assert from "node:assert"
import test, { suite } from "node:test"
import { types } from "../../../dist/main.js"
import { isGeneratorFunction } from "node:util/types"

const {
	isNumber,
	isFunction,
	isString,
	isBoolean,
	isSymbol,
	isObject,
	isNull,
	isUndefined,
	isNullary,
	typeOf,
	isArray,
	isSet,
	isMap,
	isNumberConvertible,
	isTruthy,
	isFalsy,
	isIterable,
} = types

suite("type", () => {
	test("isNumber", () => {
		assert(isNumber(9))
		assert(!isNumber("s"))
		assert(!isNumber(new Number(20)))
	})

	test("isFunction", () => {
		assert(isFunction(isFunction))
		assert(!isFunction({}))
	})

	test("isString", () => {
		assert(isString(""))
		assert(!isString(90))
	})

	test("isBoolean", () => {
		assert(isBoolean(true))
		assert(!isBoolean(null))
	})

	test("isSymbol", () => {
		assert(isSymbol(Symbol("R")))
		assert(isSymbol(Symbol.iterator))
		assert(!isSymbol("R"))
	})

	test("isObject", () => {
		assert(isObject({}))
		assert(isObject(null))
		assert(isObject(new String("james rockerfeller")))
		assert(!isObject(90))
	})

	test("isNull", () => {
		assert(isNull(null))
		assert(!isNull(undefined))
	})

	test("isUndefined", () => {
		assert(isUndefined(undefined))
		assert(!isUndefined(null))
	})

	test("isNullary", () => {
		assert(isNullary(null))
		assert(isNullary(undefined))
		assert(!isNullary(""))
	})

	test("typeOf", () => {
		assert.strictEqual(typeOf("9"), "string")
		assert.strictEqual(typeOf(9), "number")
		assert.strictEqual(typeOf(typeOf), "function")
		assert.strictEqual(typeOf(null), "object")
	})

	test("isArray", () => {
		assert(isArray([]))
		assert(!isArray({}))
		assert(isArray(new (class extends Array {})()))
	})

	test("isSet", () => assert(isSet(new Set())))

	test("isMap", () => assert(isMap(new Map())))

	test("isNumberConvertible", () => {
		assert(isNumberConvertible(9))
		assert(isNumberConvertible("9"))
		assert(isNumberConvertible(null))
		assert(isNumberConvertible(true))
		assert(isNumberConvertible(false))

		assert(!isNumberConvertible(undefined))
		assert(!isNumberConvertible("Raphael"))
		assert(!isNumberConvertible(NaN))
		assert(!isNumberConvertible(Symbol("This is going to break")))
	})

	test("isTruthy", () => {
		assert(isTruthy(true))
		assert(isTruthy(1))
		assert(!isTruthy(0))
		assert(!isTruthy(""))
		assert(!isTruthy(false))
	})

	test("isFalsy", () => {
		assert(isFalsy(false))
		assert(isFalsy(0))
		assert(isFalsy(""))
		assert(isFalsy(null))
		assert(isFalsy(undefined))

		assert(!isFalsy(true))
		assert(!isFalsy(1))
	})

	test("isIterable", () => {
		assert(isIterable([]))
		assert(isIterable(""))
		assert(
			isIterable({
				[Symbol.iterator]: function* () {
					yield 4
				},
			}),
		)
		assert(isIterable(new Set()))
		assert(isIterable(new Map()))
		assert(!isIterable(3))
		assert(!isIterable(true))
		assert(!isIterable({}))
		assert(!isIterable(Symbol("c")))
	})
})
