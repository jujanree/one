import assert from "node:assert"
import test, { suite } from "node:test"

import {
	recursiveSame as array_recursiveSame,
	same as array_same,
} from "../../../dist/src/array/array.js"
import { propDefine, type KeyValues } from "../../../dist/src/object/main.js"
import {
	isArray,
	isNumber,
	isString,
	isTruthy,
	verifyConstructor,
} from "../../../dist/src/types/types.js"

import { object, testing } from "../../../dist/main.js"
import { argWaster } from "../../../dist/src/functional/functional.js"

const { assertThrows } = testing
const {
	kv,
	same,
	dekv,
	prototype,
	structCheck,
	keys,
	values,
	recursiveStringKeys,
	recursiveSymbolKeys,
	ownProperties,
	ownKeys,
	ownValues,
	copy,
	recursiveSame,
	withoutProperties,
	findOwnMissing,
	allocator,
	toMap,
	prop,
	protoProp,
	extendPrototype,
	propertyDescriptors,
	descriptor,
} = object

const {
	classWrapper,
	withoutConstructor,
	mixin,
	delegateMethod,
	delegateProperty,
	calledDelegate,
	attachConst,
	attachGetter,
} = object.classes

const s = Symbol("R")
const subObject = { K: null }
const getObject = () => ({
	A: 10,
	[s]: true,
	T: subObject,
})

const methFunction = () => console.log("rumpus")
const bs = Symbol("Nabe")

const getPrototypeObject = () => {
	const target = {
		[bs]: "55",
		1919: "kr40al",
		meth: methFunction,
	}
	const proto = getObject()
	Object.setPrototypeOf(proto, {})
	Object.setPrototypeOf(target, proto)
	return target
}

const kvTests: any = {
	own: [
		["A", "T", s],
		[10, subObject, true],
	],
	prototype: [
		["1919", "meth", "A", "T", bs, s],
		["kr40al", methFunction, 10, subObject, "55", true],
	],
	string: {
		own: [
			["A", "T"],
			[10, subObject],
		],
		prototype: [
			["1919", "meth", "A", "T"],
			["kr40al", methFunction, 10, subObject],
		],
	},
	symbol: {
		own: [[s], [true]],
		prototype: [
			[bs, s],
			["55", true],
		],
	},
	ownOnly: {
		prototype: [
			["1919", "meth", bs],
			["kr40al", methFunction, "55"],
		],
	},
}

suite("object", () => {
	test("kv", () => {
		assert(array_recursiveSame(kv(getObject()), kvTests.own))
		assert(array_recursiveSame(kv(getPrototypeObject()), kvTests.prototype))
	})

	test("dekv", () => {
		const object = getObject()
		const protoObj = getPrototypeObject()

		const reconstruct = (x: object) => dekv(kv(x))

		assert(same(reconstruct(object), object))
		assert(same(reconstruct(protoObj), protoObj))
		assert(!same(prototype(reconstruct(protoObj)), protoObj))
	})

	suite("structCheck", () => {
		const stringProps = ["rao", "word"]
		const symbolProps = ["s", "t"].map(Symbol)
		const [s, t] = symbolProps
		const shapeKeys = [...stringProps, ...symbolProps]
		const shapePredicates = [isNumber, isString, isArray, isTruthy] as ((
			x: any,
		) => boolean)[]

		const shape_kv: KeyValues<(x: any) => boolean> = [
			shapeKeys,
			shapePredicates,
		]
		const shapeObj = dekv(shape_kv)

		const meat = Symbol("meat")
		const optionalKeys = ["raaf", meat]

		const r = Symbol("r")
		const lackingProps = ["board", r]

		const getEmpty = () => ({})

		const getStructValid = () => ({
			rao: 22,
			[s]: [],
			[t]: 20,
			word: "Sairo",
		})

		const getStructInvalid = () => ({
			...getStructValid(),
			word: 22,
		})

		const getStructExcessive = () => ({
			...getStructValid(),
			bb: 429,
		})

		const getStructOptional = () => ({
			...getStructValid(),
			[meat]: true,
			raf: 17,
		})

		const getStructViolating = () => ({
			...getStructValid(),
			board: 20,
			[r]: null,
		})

		const emptyForbidding = (pred: (x: any) => boolean) =>
			assert(!pred(getEmpty()))
		const emptyAllowing = (pred: (x: any) => boolean) =>
			assert(pred(getEmpty()))
		const insufficientForbidding = (pred: (x: any) => boolean) => {
			assert(!pred({ [s]: [] }))
			assert(!pred({ [s]: [], [t]: 20 }))
			assert(!pred({ rao: 22 }))
		}

		const validAllowing = (pred: (x: any) => boolean) =>
			assert(pred(getStructValid()))

		const excessiveAllowing = (pred: (x: any) => boolean) =>
			assert(pred(getStructExcessive()))

		const excessiveForibidding = (pred: (x: any) => boolean) =>
			assert(!pred(getStructExcessive()))

		const invalidForbidding = (pred: (x: any) => boolean) =>
			assert(!pred(getStructInvalid()))

		const optionalAllowing = (pred: (x: any) => boolean) =>
			assert(!pred(getStructOptional()))

		const violatingForbidding = (pred: (x: any) => boolean) =>
			assert(!pred(getStructViolating()))

		const nonEmptyStrictTest = (nonEmptyStrict: (x: any) => boolean) => {
			emptyForbidding(nonEmptyStrict)
			insufficientForbidding(nonEmptyStrict)
			invalidForbidding(nonEmptyStrict)
			excessiveForibidding(nonEmptyStrict)
			validAllowing(nonEmptyStrict)
		}

		test("with empty structs [isStrict = false]", {}, () => {
			const [emptyStructArr, emptyStructObj] = [[], {}].map((x) =>
				structCheck(x),
			)

			const emptyTest = (emptyStruct: (x: any) => boolean) => {
				emptyAllowing(emptyStruct)
				assert(emptyStruct([]))
				assert(emptyStruct(new Set()))
				assert(emptyStruct({ K: "S", [Symbol.iterator]: function* () {} }))

				assert(!emptyStruct(null))
				assert(!emptyStruct(3))
				assert(!emptyStruct(true))
				assert(!emptyStruct(new Function()))
			}

			emptyTest(emptyStructArr)
			emptyTest(emptyStructObj)
		})

		test("with empty structs [isStrict = true, optional = []]", () => {
			const emptyStrict = structCheck({}, [], true, [])

			const emptyStrictTest = (emptyStrict: (x: any) => boolean) => {
				assert(!emptyStrict({ K: "S", R: 2 }))
				assert(!emptyStrict(null))
				assert(!emptyStrict(3))
				assert(!emptyStrict([]))
				assert(!emptyStrict(new Set()))

				emptyAllowing(emptyStrict)
			}

			emptyStrictTest(emptyStrict)
		})

		test("with empty structs [isStrict = true, optional != []]", () => {
			const emptyOptional = structCheck([], [], true, shapeKeys)

			const emptyOptionalTest = (emptyOptional: (x: any) => boolean) => {
				emptyAllowing(emptyOptional)
				validAllowing(emptyOptional)

				assert(emptyOptional({ rao: "" }))
				assert(emptyOptional({ [s]: 49 }))
				assert(!emptyOptional({ K: true }))
			}

			emptyOptionalTest(emptyOptional)
		})

		test("with empty structs [lacking != []]", () => {
			const emptyLacking = structCheck([], lackingProps)

			const emptyLackingTest = (emptyLacking: (x: any) => boolean) => {
				emptyAllowing(emptyLacking)
				assert(emptyLacking({ S: 70, K: 20 }))
				assert(!emptyLacking({ S: 70, [r]: 29 }))
				assert(!emptyLacking({ board: true }))
			}

			emptyLackingTest(emptyLacking)
		})

		test("with non-empty structs [isStrict = false]", () => {
			const nonEmptyStruct = structCheck(shapeObj)

			const nonEmptyStructTest = (nonEmptyStruct: (x: any) => boolean) => {
				emptyForbidding(nonEmptyStruct)
				insufficientForbidding(nonEmptyStruct)
				validAllowing(nonEmptyStruct)
				excessiveAllowing(nonEmptyStruct)
				invalidForbidding(nonEmptyStruct)
			}

			nonEmptyStructTest(nonEmptyStruct)
		})

		test("with non-empty structs [isStrict = true, optional = []]", () =>
			nonEmptyStrictTest(structCheck(shapeObj, [], true, [])))

		test("with non-empty structs [isStrict = true, optional != []]", () => {
			const nonEmptyOptional = structCheck(shapeObj, [], true, optionalKeys)

			const nonEmptyOptionalTest = (nonEmptyOptional: (x: any) => boolean) => {
				nonEmptyStrictTest(nonEmptyOptional)
				optionalAllowing(nonEmptyOptional)
			}

			nonEmptyOptionalTest(nonEmptyOptional)
		})

		test("with non-empty structs [lacking != []]", () => {
			const lackingNonEmpty = structCheck(shapeObj, lackingProps)
			const lackingNonEmptyTest = (lackingNonEmpty: (x: any) => boolean) => {
				emptyForbidding(lackingNonEmpty)
				insufficientForbidding(lackingNonEmpty)
				validAllowing(lackingNonEmpty)
				excessiveAllowing(lackingNonEmpty)
				violatingForbidding(lackingNonEmpty)
				invalidForbidding(lackingNonEmpty)
			}

			lackingNonEmptyTest(lackingNonEmpty)
		})
	})

	test("keys", () => {
		assert(array_same(keys(getObject()), kvTests.own[0]))
		assert(array_same(keys(getPrototypeObject()), kvTests.prototype[0]))
	})

	test("values", () => {
		assert(same(values(getObject()), kvTests.own[1]))
		assert(same(values(getPrototypeObject()), kvTests.prototype[1]))
	})

	test("recursiveStringKeys", () => {
		assert(array_same(recursiveStringKeys(getObject()), kvTests.string.own[0]))
		assert(
			array_same(
				recursiveStringKeys(getPrototypeObject()),
				kvTests.string.prototype[0],
			),
		)
	})

	test("recursiveSymbolKeys", () => {
		assert(array_same(recursiveSymbolKeys(getObject()), kvTests.symbol.own[0]))
		assert(
			array_same(
				recursiveSymbolKeys(getPrototypeObject()),
				kvTests.symbol.prototype[0],
			),
		)
	})

	test("ownProperties", () => {
		assert(array_recursiveSame(ownProperties(getObject()), kvTests.own))
		assert(
			array_recursiveSame(
				ownProperties(getPrototypeObject()),
				kvTests.ownOnly.prototype,
			),
		)
	})

	test("ownKeys", () => {
		assert(array_same(ownKeys(getObject()), kvTests.own[0]))
		assert(
			array_same(ownKeys(getPrototypeObject()), kvTests.ownOnly.prototype[0]),
		)
	})

	test("ownValues", () => {
		assert(array_same(ownValues(getObject()), kvTests.own[1]))
		assert(
			array_same(ownValues(getPrototypeObject()), kvTests.ownOnly.prototype[1]),
		)
	})

	test("copy", () => {
		const X = getObject()
		assert.notStrictEqual(copy(X), X)
		assert(same(copy(X), X))
	})

	suite("propertyDescriptors", () => {
		const method = function () {
			return true
		}
		const propDescSimple = {
			method: { value: method, writable: true },
			X: { value: 99 },
		}

		const expectedRetained = {
			X: {
				value: 99,
				writable: false,
				enumerable: false,
				configurable: false,
			},
		}

		const expectedDescSimple = {
			method: {
				value: method,
				writable: true,
				enumerable: false,
				configurable: false,
			},
			...expectedRetained,
		}

		class T {}
		Object.defineProperties(T.prototype, propDescSimple)

		test("simple case", () =>
			assert(
				recursiveSame(
					withoutConstructor(propertyDescriptors(T.prototype)),
					expectedDescSimple,
				),
			))

		const method2 = function () {
			return 1911
		}
		const s99 = Symbol("99")
		const propsAddition = {
			method: { value: method2 },
			L: { value: s99 },
		}

		const overridenPortion = {
			method: {
				value: method2,
				writable: false,
				enumerable: false,
				configurable: false,
			},
		}

		const expectedPropsAddition = {
			L: {
				value: s99,
				writable: false,
				enumerable: false,
				configurable: false,
			},
		}

		const expectedNewDescriptors = {
			...overridenPortion,
			...expectedPropsAddition,
			...expectedRetained,
		}

		class R extends T {}
		Object.defineProperties(R.prototype, propsAddition)

		test("recursive case", () =>
			assert(
				recursiveSame(
					withoutConstructor(propertyDescriptors(R.prototype)),
					expectedNewDescriptors,
				),
			))
	})

	test("findOwnMissing", () => {
		const iterator = function* () {}
		assert(
			same(
				findOwnMissing(getObject(), {
					A: "17",
					B: false,
					[Symbol.iterator]: iterator,
					[s]: 11,
				}),
				{
					B: false,
					[Symbol.iterator]: iterator,
				},
			),
		)
	})

	test("allocator", () => {
		const X = getObject()
		const alloc_obj = allocator(X)

		assert(same(alloc_obj(), X))
		assert(recursiveSame(alloc_obj(), X))
		assert.notStrictEqual(alloc_obj(), X)
		assert.notStrictEqual(alloc_obj(), alloc_obj())
	})

	test("same", () => {
		const X = getObject()
		assert(same(X, getObject()))
		assert(same(X, X))

		const numObject = {
			x: 1,
			y: 20,
			z: 47,
		}

		const squareObject = {
			x: 1,
			y: 400,
			z: 2209,
		}

		const nonSquareObject = {
			y: 400,
			z: 2209,
			x: 1,
		}

		const firstSquared = (x: number, y: number) => x ** 2 === y

		assert(same(numObject, squareObject, firstSquared))
		assert(!same(numObject, nonSquareObject, firstSquared))
	})

	test("toMap", () => {
		const X = getObject()
		const map = toMap(X)
		assert(array_same([...map.keys()], keys(X)))
		assert(array_same([...map.values()], values(X)))
	})

	test("recursiveSame", () => {
		const X = getObject()
		assert(recursiveSame(getObject(), X))
		assert(recursiveSame(X, X))

		const numObject = {
			s: {
				b: 40,
				r: 90,
				l: {
					m: 3,
				},
			},
			k: 7,
		}

		const addObject = {
			s: {
				b: 43,
				r: 93,
				l: {
					m: 6,
				},
			},
			k: 10,
		}

		const nonAddObject1 = {
			k: 10,
			s: {
				b: 43,
				r: 93,
				l: {
					m: 6,
				},
			},
		}

		const nonAddObject2 = {
			k: 10,
			s: {
				b: 43,
				r: 93,
				l: {},
			},
		}

		const addedThree = (x: number, y: number) => x + 3 === y

		assert(recursiveSame(numObject, addObject, addedThree))
		assert(!recursiveSame(numObject, nonAddObject1, addedThree))
		assert(!recursiveSame(numObject, nonAddObject2, addedThree))
	})

	test("withoutProperties", () => {
		const withObj = {
			R: 90,
			C: 20,
			[s]: 440,
			N: "Ah?",
			[bs]: "T",
		}

		const sans = withoutProperties("A", s, "B", "C")

		assert(same(sans(withObj), { R: 90, N: "Ah?", [bs]: "T" }))
		assert.notStrictEqual(sans(withObj), withObj)
	})

	test("prop", () => {
		assert.strictEqual(prop("x")({ y: 23, x: 17 }), 17)
	})

	test("protoProp", () => {
		class C {}

		const cPre = new C() as { soon?: any }
		protoProp(C, "soon", { value: true })
		const cPost = new C() as { soon: boolean }

		assert.strictEqual(cPre.soon, cPost.soon)
		assert.strictEqual(cPre.soon, true)
		assert.strictEqual(prototype(cPre), prototype(cPost))
	})

	test("extendPrototype", () => {
		class C {
			k = 0
		}

		interface D {
			k: number
			d: number
			readonly c: number
		}

		const c1 = new C() as D
		const c2 = new C() as D

		extendPrototype(C, {
			c: { value: 17 },
			d: {
				set: function () {
					++this.k
				},
				get: function () {
					return this.k - 11
				},
			},
		})

		c1.d = 10
		c1.d = 27
		c1.d = 19

		assert.strictEqual(c1.d, -8)
		assert.strictEqual(c2.d, -11)
		assert.strictEqual(c1.c, c2.c)
	})

	suite("classes", () => {
		test("classWrapper", () => {
			class C {
				k: number
				constructor(k = 17) {
					this.k = k
				}
			}

			const t = argWaster(1)(classWrapper(C)) as (...args: any[]) => C

			const c = t()
			const c1 = t(11)

			assert.strictEqual(c.k, 17)
			assert.strictEqual(c1.k, 17)
		})

		test("withoutConstructor", () => {
			const C = { constructor: function () {} }
			assert.strictEqual(withoutConstructor(C).constructor, Object)
		})

		test("mixin", () => {
			class C {
				constructor(public r: number) {}
			}

			class D {
				constructor() {}
				meth1() {}
				meth2() {}
				meth3() {}
				meth4() {}
			}

			class E {
				meth1() {}
			}

			class F {
				x: number
				constructor(x: number) {
					this.x = 90 + x
				}
				meth3() {}
			}

			mixin(C, [D, E, F])

			const c = new C(3) as {
				r: number
				meth1(): any
				meth2(): any
				meth3(): any
				meth4(): any
			}

			assert.strictEqual(c.r, 3)
			assert.strictEqual(c.meth1, E.prototype.meth1)
			assert.strictEqual(c.meth2, D.prototype.meth2)
			assert.strictEqual(c.meth3, F.prototype.meth3)
			assert.strictEqual(c.meth4, D.prototype.meth4)
		})

		test("delegateMethod", () => {
			class B {
				constructor(public r: number = 11) {}

				meth1(x: number) {
					return this.r * x
				}
			}

			class C {
				constructor(public b: B) {}
			}

			const b = new B()
			const c = new C(b)
			const callDelegate = delegateMethod("b")("meth1").bind(c)

			assert.strictEqual(callDelegate(3), 33)
			assert.strictEqual(callDelegate(9), 99)

			b.r = 2
			assert.strictEqual(callDelegate(2), 4)
		})

		test("delegateProperty", () => {
			class B {
				constructor(public r: number) {}
			}

			class C {
				constructor(public b: B) {}
			}

			const b = new B(13)
			const c = new C(b)

			const getProperty = delegateProperty("b")("r").bind(c)
			assert.strictEqual(getProperty(), 13)

			b.r = 1119
			assert.strictEqual(getProperty(), 1119)
		})

		test("calledDelegate", () => {
			class B {
				constructor(public r: number) {}
				meth1(x: number) {
					return this.r * x
				}
			}

			class C {
				constructor(
					public b: B,
					public r: number,
				) {}
			}

			const b1 = new B(7)
			const c1 = new C(b1, 5)

			const b2 = new B(4)
			const c2 = new C(b2, 3)

			const callDelegate = calledDelegate("b")("meth1")

			assert.strictEqual(callDelegate(c1, 3), 15)
			assert.strictEqual(callDelegate(c2, 3), 9)
		})

		test("attachGetter", () => {
			function f(a: any) {
				a.a = 11
			}

			interface AObj {
				readonly a: number
			}

			const get = () => 10
			function _A() {}
			const A = verifyConstructor<AObj>(_A)
			attachGetter(A, "a", get)

			const a = new A()
			assert.strictEqual(a.a, 10)
			assertThrows(() => f(a))
			assert.strictEqual(a.a, 10)
		})

		test("attachConst", () => {
			interface AObj {
				readonly a: number
			}

			function f(a: any) {
				a.a = 11
			}

			function _A() {}
			const A = verifyConstructor<AObj>(_A)
			attachConst(A, "a", 10)

			const a = new A()
			assert.strictEqual(a.a, 10)
			assertThrows(() => f(a))
			assert.strictEqual(a.a, 10)
		})
	})

	suite("descriptor", () => {
		test("Value", () => {
			const desc = descriptor.Value(10)
			const a: any = { b: 11 }
			propDefine(a, "a", desc)

			assert.strictEqual(a.a, 10)
			assert.strictEqual(a.b, 11)

			a.b = 12

			assertThrows(() => (a.a = 11))
			assert.strictEqual(a.b, 12)
			assert.strictEqual(a.a, 10)
		})

		test("Enumerable", () => {
			const desc1 = descriptor.Value(11)
			const desc2 = {
				...descriptor.Value(12),
				...descriptor.Enumerable(),
			}

			interface C {
				readonly b: number
				readonly a?: number
				readonly c?: number
			}

			const a: C = { b: 11 }
			propDefine(a, "a", desc1)
			propDefine(a, "c", desc2)

			assert(!a.propertyIsEnumerable("a"))
			assert(a.propertyIsEnumerable("b"))
			assert(a.propertyIsEnumerable("c"))

			const props: string[] = []
			for (const p in a) props.push(p)
			assert(array_same(props, ["b", "c"]))
		})

		test("Getter", () => {
			const desc = descriptor.Getter(function () {
				return Math.sqrt(this.x ** 2 + this.y ** 2)
			})

			interface Point {
				readonly x: number
				readonly y: number
				readonly diagonal?: number
			}

			const point: Point = {
				x: 13,
				y: 84,
			}

			propDefine(point, "diagonal", desc)
			assert.strictEqual(point.diagonal, 85)
			assertThrows(() => ((point as any).diagonal = () => 0))
		})

		// TODO: finish
	})
})
