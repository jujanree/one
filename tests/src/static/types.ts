import test, { suite } from "node:test"
import { types } from "../../../dist/main.js"
import assert from "assert"

const { verifyConstructor } = types

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
})
