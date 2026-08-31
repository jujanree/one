import { equals, T } from "../boolean/boolean.js"
import { isStruct, TypePredicate } from "../types/types.js"

import assert from "node:assert"
import {
	same as array_same,
	ArraySet,
	difference,
	intersection,
	Pair,
} from "../array/array.js"
import type { Constructor } from "../types/types.js"

/**
 * Represents a pair of object's keys-array and values-array
 */
export type KeyValues<T extends any = any> = Pair<KeyArray, T[]>

/**
 * Represents an object key after automatic `number -> string` conversion
 */
export type ObjectKey = string | symbol

export type FinalKeys = ObjectKey[]

export type KeyArray = PropertyKey[]

/**
 * Represents an object shape (property-presence-wise and, possibly,
 * predicate-wise for some or all properties)
 */
export type ShapeArg =
	| KeyArray
	| { [x: PropertyKey]: ((x?: any) => boolean) | null | undefined }

/**
 * Returns `[keys(obj), values(obj)]`
 */
export function kv<V = any>(obj: Record<any, V>): KeyValues<V> {
	return [keys(obj), values(obj)]
}

/**
 * Creates a new object using `KeysValues<T>`
 */
export const dekv = <T = any>([keys, values]: KeyValues<T>): Record<
	ObjectKey,
	T
> => {
	const result = empty()
	for (let i = 0; i < keys.length; ++i) result[keys[i]] = values[i]
	return result
}

export class Shape<T extends object = any> {
	private readonly optional: ArraySet<PropertyKey>

	asPredicate(): TypePredicate<T> {
		return (x: any): x is T => this.verify(x)
	}

	verify(x: any): boolean {
		if (!isStruct(x)) return false
		if (!this.properties.every((p) => p in x)) return false
		if (this.lacks.some((p) => p in x)) return false
		if (!this.verifyValues(x)) return false
		if (!this.isStrict) return true

		const currKeys = keys(x)
		const keyCount = currKeys.length
		const propCount = this.properties.length
		if (propCount === keyCount) return true
		if (keyCount - propCount > this.optional.length) return false
		return difference(currKeys, this.properties).every((key) =>
			this.optional.has(key),
		)
	}

	private verifyValues(x: object) {
		return this.predicates.every((p, i) => (p || T)(x[this.properties[i]]))
	}

	constructor(
		private readonly properties: KeyArray,
		private readonly predicates: ((x: any) => any)[],
		private readonly lacks: KeyArray = [],
		private readonly isStrict = false,
		optional: KeyArray = [],
	) {
		this.optional = new ArraySet(optional)
	}
}

export namespace Shape {
	export class Builder<T extends object = any> {
		private isStrict = false
		private readonly added: KeyArray
		private readonly predicates: ((x: any) => any)[]
		private readonly removed: KeyArray
		private readonly optionals: KeyArray

		add(property: PropertyKey, predicate?: (x: any) => any) {
			this.added.push(property)
			this.predicates.push(predicate || T)
			return this
		}

		remove(property: PropertyKey) {
			this.removed.push(property)
			return this
		}

		makeStrict() {
			this.isStrict = true
			return this
		}

		optional(property: PropertyKey) {
			this.optionals.push(property)
			return this
		}

		private assertPropsCompatible() {
			assert.strictEqual(intersection(this.removed, this.added).size, 0)
		}

		build() {
			this.assertPropsCompatible()
			return new Shape<T>(
				this.added,
				this.predicates,
				this.removed,
				this.isStrict,
				this.optionals,
			)
		}
	}
}

/**
 * Returns a list of object's keys [
 * 	includes the prototypes and non-enumerables,
 * 	without `Object.prototype` (unless otherwise specified)
 * ]
 */
export function keys(
	object: object,
	includeObject: boolean = false,
): FinalKeys {
	const props: FinalKeys = recursiveStringKeys(object, includeObject)
	props.push(...recursiveSymbolKeys(object, includeObject))
	return props
}

/**
 * Returns the array of object values [includes the prototypes]
 */
export function values(object: object, includeObject: boolean = false): any[] {
	return keys(object, includeObject).map(valueGetter(object))
}

/**
 * Returns the array of string keys of a given object
 * [includes the prototypes and non-enumerables, hence "recursive"]
 */
export function recursiveStringKeys(
	object: object,
	includeObject: boolean = false,
) {
	return recursiveIterate(object, Object.getOwnPropertyNames, includeObject)
}

export function recursiveIterate<T = any>(
	object: object,
	iter: (object: object) => T[],
	includeObject: boolean = false,
) {
	const values = iter(object)
	let proto: object
	while ((proto = prototype(object))) {
		if (!includeObject && proto === Object.prototype) break
		values.push(...iter((object = proto)))
	}
	return values
}

/**
 * Returns an array of object's `symbol`-keys
 * [includes the prototypes and non-enumerables]
 */
export function recursiveSymbolKeys(
	object: object,
	includeObject: boolean = false,
) {
	return recursiveIterate(object, Object.getOwnPropertySymbols, includeObject)
}

/**
 * Returns a pair of
 */
export const ownProperties = (object: object): [FinalKeys, any[]] => {
	const own = ownKeys(object)
	return [own, own.map((k) => object[k])]
}

/**
 * Returns the own keys of a given object
 */
export function ownKeys(object: object) {
	const keys: (string | symbol)[] = Object.getOwnPropertyNames(object)
	keys.push(...Object.getOwnPropertySymbols(object))
	return keys
}

/**
 * Alias of 'Object.getPrototypeOf'
 */
export function prototype(o: any): any {
	return Object.getPrototypeOf(o)
}

/**
 * Makes a shallow copy of a given object
 */
export const copy = <T extends object = object>(x: T) => ({ ...x })

/**
 * Returns the object containing all the property descriptors on a given object `object`
 * [includes the prototypes, respects inheritance],
 * up to the point of meeting the object of `commonPrototype` in the prototype chain
 * (defaults to `Object.prototype`).
 */
export function propertyDescriptors(
	object: object,
	commonPrototype: object = Object.prototype,
) {
	let currPrototype = object
	let final = Object.getOwnPropertyDescriptors(object)

	while (prototype(currPrototype) !== commonPrototype)
		final = {
			...final,
			...getOwnMissing(
				final,
				Object.getOwnPropertyDescriptors(
					(currPrototype = prototype(currPrototype)),
				),
			),
		}

	return final
}

/**
 * Returns a new object containing all the own properties of `source`
 * not found in `target`
 */
export function getOwnMissing(target: object, source: object) {
	const result: object = empty()
	for (const x of ownKeys(source)) if (!(x in target)) result[x] = source[x]
	return result
}

/**
 * Returns a new empty object
 */
export const empty = () => ({})

/**
 * Curries shallow copying of `object`
 */
export const allocator =
	<T extends object = object>(object: T) =>
	() =>
		copy(object)

/**
 * Compares two objects by precise key equality (includes order), and
 * `pred(vx[i], vy[i], i)` for `vx`, `vy` - values of `x` and `y` respectively.
 *
 * `pred` defaults to equality
 */
export const same = (
	x: object,
	y: object,
	pred?: (x?: any, y?: any, i?: number) => boolean,
) => array_same(keys(x), keys(y)) && array_same(values(x), values(y), pred)

/**
 * Recursive version of `object.same` (every pair of object elements (x[i], y[i])
 * must also meet the criteria of `recursiveSame(x[i], y[i], pred)`)
 */
export function recursiveSame(
	x: object,
	y: object,
	pred: (x?: any, y?: any, i?: number) => boolean = equals,
): boolean {
	const yvals = values(y)
	return (
		array_same(keys(x), keys(y)) &&
		values(x).every((x, i) =>
			isStruct(x) && isStruct(yvals[i])
				? recursiveSame(x, yvals[i], pred)
				: pred(x, yvals[i], i),
		)
	)
}

/**
 * Returns a copy of a given object without the `props`
 */
export function withoutProperties(...props: ObjectKey[]) {
	const toRemove = new Set(props)
	return function (object: object) {
		const newObj: object = empty()
		for (const prop of keys(object))
			if (!toRemove.has(prop)) newObj[prop] = object[prop]
		return newObj
	}
}

/**
 * Curries `x[key]`
 */
export const valueGetter = (x: object) => (key: ObjectKey) => x[key]

/**
 * Curries `x[key]`
 */
export const prop =
	(key: ObjectKey) =>
	(x: object): any =>
		x[key]

/**
 * Alias of 'Object.defineProperty'
 */
export const propDefine = Object.defineProperty

/**
 * Alias of 'Object.defineProperties'
 */
export const propsDefine = Object.defineProperties

/**
 * Defines a property with a name `name` and `value` on `Extended.prototype`
 */
export const protoProp = (
	Extended: Constructor,
	name: PropertyKey,
	value: PropertyDescriptor,
) => propDefine(Extended.prototype, name, value)

/**
 * Applies a given `PropertyDescriptorMap` on `Extended.prototype`
 * [defines new properties]
 */
export const extendPrototype = (
	Extended: Constructor,
	properties: PropertyDescriptorMap,
) => propsDefine(Extended.prototype, properties)

export * as classes from "./classes.js"
export * as descriptor from "./descriptor.js"
