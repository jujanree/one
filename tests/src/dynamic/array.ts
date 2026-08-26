import assert from "assert"
import test, { suite } from "node:test"
import { array } from "../../../dist/main.js"
import { isArray } from "../../../dist/src/types/types.js"

const {
	isTuple,
	isPair,
	same,
	lastOut,
	last,
	setLast,
	clear,
	insert,
	replace,
	without,
	firstOut,
	first,
	copy,
	empty,
	unique,
	and,
	or,
	allocator,
	recursiveSame,
	substitute,
	keys,
	numbers,
	zeros,
	fill,
	repeat,
	from,
	isEmpty,
	lastIndex,
	difference,
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
		assert(same(insert(X, 1, [-1, -2, -3]), [0, -1, -2, -3, 1, 2, 3]))
		assert(same(insert(X, 0, [14, 29]), [14, 29, 0, 1, 2, 3]))
	})

	test("replace", () => {
		const X: any[] = getArray()
		assert(same(replace(X, 0, ["R", "A", "9"]), ["R", "A", "9", 1, 2, 3]))
		assert(same(replace(X, 1, [true]), [0, true, 2, 3]))
	})

	test("without", () => {
		const X = getArray()
		assert(same(without(X, 0), [1, 2, 3]))
		assert(same(without(without(X, 2), 1), [0, 3]))
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
				(x, y) => x === y! ** 3,
			),
		)
		assert(
			same(
				X.map((x) => x + 1),
				X,
				(x, y, i) => x - 1 === y && y === X[i],
			),
		)
	})

	test("unique", () => {
		const X = [0, 1, 1, 2, 2, 2, 3, 1]
		assert(same(unique(X), getArray()))
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

	test("zeros", () => {
		const res = zeros(10)
		assert.strictEqual(res.length, 10)
		assert(res.every((x) => x === 0))
	})

	test("fill", () => {
		const arr1 = getArray()
		fill(arr1, [0, 2], [11, 5])
		assert(same(arr1, [11, 1, 5, 3]))

		const arr2 = []
		fill(arr2, [11, 19, 3], [0, 1, 9])
		assert.strictEqual(arr2.length, 20)
		assert.strictEqual(arr2[3], 9)
		assert.strictEqual(arr2[11], 0)
		assert.strictEqual(arr2[19], 1)
	})

	test("repeat", () => {
		const arrOrig = getArray()
		const arrRepeated = repeat(arrOrig, 5)
		assert.strictEqual(arrRepeated.length, arrOrig.length * 5)
		assert(arrRepeated.every((x, i) => x === arrOrig[i % arrOrig.length]))
	})

	test("from", () => {
		const arr = from(5, (i) => (i + 1) ** 2)
		assert(same(arr, [1, 4, 9, 16, 25]))
	})

	test("isEmpty", () => {
		assert(isEmpty([]))
		assert(!isEmpty([1]))

		const pseudoEmpty = Array(10).fill(11)
		pseudoEmpty.length = 0
		assert(isEmpty(pseudoEmpty))
	})

	test("lastIndex", () => {
		assert.strictEqual(lastIndex([]), -1)
		assert.strictEqual(lastIndex([1, 2, 3, 4]), 3)
	})

	test("difference", () => {
		assert(
			same(difference(["A", "B", "C", "D", "E", "F"], ["C", "B", "F"]), [
				"A",
				"D",
				"E",
			]),
		)
		assert(same(difference([], [12345]), []))
	})
})
