import type { Constructor } from "../types/types.js"
import { Getter, Value } from "./descriptor.js"
import {
	extendPrototype,
	propertyDescriptors,
	protoProp,
	withoutProperties,
} from "./main.js"

/**
 * Curries the expression for `new X(...args)`
 */
export const classWrapper =
	<T = any, Signature extends readonly any[] = any[]>(
		X: new (...args: Signature) => T,
	) =>
	(...args: Signature) =>
		new X(...args)

/**
 * Curries the expression for `function (...args) { return this[propName][methodName](...args) }`
 */
export const delegateMethod = (propName: string) => (methodName: string) =>
	function (...args: any[]) {
		return this[propName][methodName](...args)
	}

/**
 * Curries the expression for `function () { return this[delegate][propName] }`
 */
export const delegateGetter = (delegate: string) => (propName: string) =>
	function () {
		return this[delegate][propName]
	}

/**
 * Mixes each of `classes` into `Extended.prototype`,
 * with the exception of their constructors (those are not
 * added and the initial constructor on `Extended` is preserved).
 *
 * Allows for easy implementations for multiple inheritance and mixin pattern
 */
export const mixin = (Extended: Constructor, classes: Constructor[]) =>
	classes.forEach((ParentClass) =>
		extendPrototype(
			Extended,
			withoutConstructor(
				propertyDescriptors(ParentClass.prototype),
			) as PropertyDescriptorMap,
		),
	)

/**
 * Returns the copy of the given object with the `.constructor` property removed
 */
export const withoutConstructor = withoutProperties("constructor")

/**
 * Curries `(called: any, ...args: any[]) => called[propName][methodName].call(called, ...args)`
 */
export const applyDelegate =
	(propName: string) => (methodName: string) => (called: any, args: any[]) =>
		called[propName][methodName].call(called, ...args)

/**
 * Adds a non-configurable, non-writable, non-enumerable
 * property `name` onto `x.prototype` defined by the constant `value`.
 */
export const attachConst = <T = any>(
	x: Constructor,
	name: PropertyKey,
	value: T,
) => protoProp(x, name, Value(value))

/**
 * Adds a non-configurable, non-enumerable, non-settable
 * property `name` onto `x.prototype` defined by getter `get`.
 */
export const attachGetter = <T = any>(
	x: Constructor,
	name: PropertyKey,
	get: () => T,
) => protoProp(x, name, Getter(get))
