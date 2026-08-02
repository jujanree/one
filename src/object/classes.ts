import type { Constructor } from "../types/types.js"
import { ConstDescriptor, GetterDescriptor } from "./descriptor.js"
import {
	extendPrototype,
	propertyDescriptors,
	protoProp,
	withoutProperties,
} from "./main.js"

/**
 * Returns a function that returns `new X(...args)`
 */
export const classWrapper =
	<T = any, Signature extends readonly any[] = any[]>(
		X: new (...args: Signature) => T,
	) =>
	(...args: Signature) =>
		new X(...args)

/**
 * Returns a method that returns `this[delegateProp][delegateMethodName](...delegateArgs)`
 */
export const delegateMethod =
	(delegatePropName: string) => (delegateMethodName: string) =>
		function (...delegateArgs: any[]) {
			return this[delegatePropName][delegateMethodName](...delegateArgs)
		}

/**
 * Returns a method that returns `this[delegatePropName][propName]`
 */
export const delegateProperty =
	(delegatePropName: string) => (propName: string) =>
		function () {
			return this[delegatePropName][propName]
		}

/**
 * Calls `extendPrototype` for each of the passed `Constructor`s `classes`,
 * that are removed their `.constructor` property from.
 *
 * Useful for multiple inheritance and mixin pattern
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
 * Returns a function that returns `called[delegatePropName][delegateMethodName].call(called, ...delegateArgs)`
 */
export const calledDelegate =
	(delegatePropName: string) =>
	(delegateMethodName: string) =>
	(called: any, ...delegateArgs: any[]) =>
		called[delegatePropName][delegateMethodName].call(called, ...delegateArgs)

export const attachConst = <T = any>(
	x: Constructor,
	name: PropertyKey,
	value: T,
) => protoProp(x, name, ConstDescriptor(value))

export const attachGetter = <T = any>(
	x: Constructor,
	name: PropertyKey,
	get: () => T,
) => protoProp(x, name, GetterDescriptor(get))
