import test, { suite } from "node:test"
import { types } from "../../../dist/main.js"
import assert from "assert"

const { verifyConstructor, verifyAbstractConstructor } = types

suite("types", () => {
	suite("verifyConstructor", () => {
		test("`this`-having function (constructor)", () => {
			interface AObject {
				readonly x: number
				readonly m: number
			}

			function _A(m: number = 0) {
				this.x = 10 + m
				this.m = m
			}

			const A = verifyConstructor<AObject>(_A)
			const a1 = new A()
			const a2 = new A(5)

			assert.strictEqual(a1.m, 0)
			assert.strictEqual(a1.x, 10)
			assert.strictEqual(a2.m, 5)
			assert.strictEqual(a2.x, 15)

			// [static] Any of those should raise an in-editor error upon de-commenting
			// a1.x = 11
			// a2.m++
		})
		test("non-`this`-having function (non-constructor)", () => {
			interface CObject {}

			let failed = false
			try {
				const _C = verifyConstructor<CObject>(() => {})
				failed = true
			} catch {}
			assert(!failed)
		})
	})

	test("verifyAbstractConstructor", () => {
		interface XObj {
			a(x: number): boolean
		}

		interface YObj extends XObj {
			getMod(): number
		}

		function _X(m: number): XObj | void {
			this._m = Math.abs(m)
		}

		_X.prototype.a = function (x: number) {
			return x > 0 && x % this._m === 1
		}

		const X = verifyAbstractConstructor(_X)

		class Y extends X implements YObj {
			// note: have to declare [NOT DEFINE] all the non-public fields and methods
			declare private readonly _m: number

			getMod(): number {
				return this._m
			}

			constructor(
				m: number,
				readonly k: number,
			) {
				super(m)
			}
		}

		const y = new Y(5, 3)
		assert.strictEqual(y.a(10), false)
		assert.strictEqual(y.a(6), true)
		assert.strictEqual(y.a(1), true)
		assert.strictEqual(y.getMod(), 5)
		assert.strictEqual(y.k, 3)

		// Should raise an error (can't create instances of abstract classes)
		// const x = new X(5)
	})
})
