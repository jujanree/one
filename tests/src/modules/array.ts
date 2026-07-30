import assert from "assert"
import test, { suite } from "node:test"
import { array } from "../../../dist/main.js"
import { isArray } from "../../../dist/src/type/type.js"

const {
	isTuple,
	isPair,
	tuple,
	same,
	lastOut,
	last,
	setLast,
	clear,
	insert,
	replace,
	out,
	firstOut,
	first,
	propPreserve,
	copy,
	empty,
	uniqueArr,
	and,
	or,
	allocator,
	recursiveSame,
	substitute,
	sort,
	keys,
	numbers,
} = array

const getArray = () => [0, 1, 2, 3]

suite("array", () => {
	test("isTuple", () => {
		const isTriple = isTuple(3)
		assert(isTriple(["1", "2", "3"]))
		assert(!isTriple([0, 1]))
		assert(!isTriple(false))
	})

	test("isPair", () => {
		assert(isPair([0, 1]))
		assert(!isPair([0, 1, 2]))
		assert(!isPair(false))
	})

	test("tuple", () => {
		const X = getArray()
		assert(same(tuple(...X), X))
	})

	test("lastOut", () => {
		const X = getArray()
		assert(same(lastOut(X), [0, 1, 2]))
	})

	test("last", () => {
		const X = getArray()
		assert.strictEqual(last(X), 3)
	})

	test("setLast", () => {
		const X = getArray()
		assert.strictEqual(setLast(X, 97), 97)
		assert.strictEqual(last(X), 97)
	})

	test("clear", () => {
		const X = getArray()
		assert.strictEqual(X.length, 4)
		clear(X)
		assert(same(X, []))
	})

	test("insert", () => {
		const X = getArray()
		assert(same(insert(X, 1, -1, -2, -3), [0, -1, -2, -3, 1, 2, 3]))
		assert(same(insert(X, 0, 14, 29), [14, 29, 0, 1, 2, 3]))
	})

	test("replace", () => {
		const X: any[] = getArray()
		assert(same(replace(X, 0, "R", "A", "9"), ["R", "A", "9", 1, 2, 3]))
		assert(same(replace(X, 1, true), [0, true, 2, 3]))
	})

	test("out", () => {
		const X = getArray()
		assert(same(out(X, 0), [1, 2, 3]))
		assert(same(out(out(X, 2), 1), [0, 3]))
	})

	test("firstOut", () => {
		const X = getArray()
		assert(same(firstOut(X), [1, 2, 3]))
		assert(same(firstOut(firstOut(X)), [2, 3]))
		assert(same(firstOut([]), []))
	})

	test("first", () => {
		const X = getArray()
		assert.strictEqual(first(X), 0)
		assert.strictEqual(first(firstOut(X)), 1)
	})

	test("propPreserve", () => {
		interface ArrHaving {
			arr: any[]
		}

		const mapPropPreserve = propPreserve((x: ArrHaving) => x.arr, ["length"])
		const X1 = mapPropPreserve({
			T: 90,
			arr: [40, 40, 19],
		})

		assert.strictEqual(X1.T, 90)
		assert(isArray(X1))

		const X2 = mapPropPreserve({
			length: 90,
			R: 20,
			arr: ["a", "b", "c"],
		})

		assert.strictEqual(X2.length, 3)
		assert.strictEqual(X2.R, 20)
		assert(isArray(X2))
	})

	test("copy", () => {
		const X = getArray()
		const XC = copy(X)
		assert(same(X, XC))
		assert.notStrictEqual(X, XC)
	})

	test("empty", () => {
		assert(same(empty(), []))
		assert.notStrictEqual(empty(), empty())
	})

	test("same", () => {
		const X = getArray()
		assert(same(X, getArray()))
		assert(
			same(
				X.map((x) => x ** 3),
				X,
				(x, y) => x === y ** 3,
			),
		)
	})

	test("uniqueArr", () => {
		const X = [0, 1, 1, 2, 2, 2, 3, 1]
		assert(same(uniqueArr(X), getArray()))
	})

	test("and", () => {
		const X = getArray()
		const Y = firstOut(X)
		assert.strictEqual(and(X), 0)
		assert.strictEqual(and(Y), 3)
	})

	test("or", () => {
		const X = getArray()
		const Y = Array(4).fill(0).concat([false])
		assert.strictEqual(or(X), 1)
		assert.strictEqual(or(Y), false)
	})

	test("allocator", () => {
		const T = ["Sss", "aa", 3]
		const X1 = allocator(T)

		assert.notStrictEqual(X1(), T)
		assert.notStrictEqual(X1(), X1())
		assert.notStrictEqual(X1(), T)
		assert(same(X1(), T))
	})

	test("recursiveSame", () => {
		type RecursiveType<T = any> = (T | RecursiveType)[]
		const recursiveMap = <T = any>(x: RecursiveType<T>, map: (x: any) => any) =>
			x.map((x) => (isArray(x) ? recursiveMap(x, map) : map(x)))

		const heterogenousItems = [["S", 10, true], [[[[], Symbol("R")]]]]
		const homogenousItems: RecursiveType<number> = [1, [2, [3, 4], 5]]

		const square = (x: number) => x ** 2
		const homogenousItemsSquared = recursiveMap(homogenousItems, square)

		assert(recursiveSame(heterogenousItems, heterogenousItems))
		assert(
			recursiveSame(
				homogenousItems,
				homogenousItemsSquared,
				(x: number, y: number) => x ** 2 === y,
			),
		)

		assert(!recursiveSame([1, 2], [1, 2, 3]))
		assert(!recursiveSame([1, 2, 4], [1, 2, 3]))
	})

	test("substitute", () => {
		const S = substitute(4, [1, 2])
		const S1 = S([24, 25])
		const S2 = S(["R", "C"])

		assert(same(S1([33, 17]), [33, 24, 25, 17]))
		assert(same(S2(["O", "S"]), ["O", "R", "C", "S"]))
	})

	test("sort", () => {
		assert(same(sort([3, 2, 1]), [1, 2, 3]))
		assert(
			same(
				sort([1, 2, 3], (a: number, b: number) => b - a),
				[3, 2, 1],
			),
		)
	})

	test("keys", () => {
		const array = getArray()
		assert(same(keys(array), array))
		assert(same(keys(["luff", "duff", "puff", "huff"]), array))
	})

	test("numbers", () => {
		const array = getArray()
		assert(same(numbers(4), array))
		assert(same(numbers(7), [0, 1, 2, 3, 4, 5, 6]))
	})
})
