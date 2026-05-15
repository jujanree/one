import { equals, T } from "../boolean/boolean.js"
import { isArray, isStruct, TypePredicate } from "../type/type.js"

import { same as array_same, Pair } from "../array/array.js"

/**
 * A type for representing a class
 */
export type Constructor<T extends object = any> = Function & { prototype: T }

/**
 * A type for representing a pair of object's keys-values
 */
export type KeyValues<T extends any = any> = Pair<KeyArray, T[]>

/**
 * Type for representing a converted object key
 */
export type ObjectKey = string | symbol
export type FinalKeys = ObjectKey[]

/**
 * Type for representing an object key
 */
export type KeyArray = PropertyKey[]

/**
 * Type for representing a shape of an object
 */
export type ShapeArg =
	| KeyArray
	| { [x: PropertyKey]: ((x?: any) => boolean) | null | undefined }

/**
 * Returns the pair of keys and values of the given object
 */
export const kv = (obj: object): [(string | symbol)[], any[]] => [
	keys(obj),
	values(obj),
]

/**
 * Creates a new object using the pair of keys and values
 */
export const dekv = <T extends any = any>([keys, values]: KeyValues<T>): Record<
	ObjectKey,
	T
> => {
	const result = empty()
	for (let i = 0; i < keys.length; ++i) result[keys[i]] = values[i]
	return result
}

/**
 * Creates a predicate for type-checking object-shapes.
 *
 * For `true`, mandates that argument be of `typeof x === "object"`. For `null`, returns `false`
 *
 * @param properties The basic object shape. If an array - items from the array are treated as keys to be checked for presence on the passed `x`. Otherwise - an object, keys of which correspond to property names to be proven to be present, and to be passing of the predicates assigned to the respective keys. Defaults to `[]`
 * @param lacks The array of keys to be shown to definitively not be present on the object. Checked before `optional`. Defaults to `[]`
 * @param optional The array of properties to be allowed on the object in the event that `isStrict` is set to `true`. Defaults to `[]`
 * @param isStrict The flag for indicating whether the shape to be checked for is "strict", meaning - whether any properties other than `properties` and `optional` are allowed. Defaults to `false`
 *
 * @example
 *
 * interface IThing {
 * 	eatable: any
 * 	fruit: bool
 * }
 *
 * interface Fruit extends IThing {
 * 	eatable: true
 * 	fruit: true
 * }
 *
 * interface Shelf extends IThing {
 * 	fruit: false
 * 	eatable: "maybe???"
 * 	robust: true
 * }
 *
 * const makeThing = (eatable: any, fruit: bool): IThing => ({ eatable, fruit })
 * const makeFruit = (): Fruit => makeThing(true, true)
 * const makeShelf = (): Shelf => { ...makeThing("maybe???", false), robust: true }
 *
 * const isThing = structCheck<IThing>({
 * 	eatable: T,
 * 	fruit: isBoolean,
 * })
 *
 * const isThingExact = structCheck<IThing>({
 * 	eatable: T,
 * 	fruit: isBoolean,
 * }, [], [], true)
 *
 * const isFruit = structCheck<Fruit>({
 * 	eatable: eqcurry(true),
 * 	fruit: eqcurry(true),
 * })
 *
 * const isShelf = structCheck<Shelf>({
 * 	eatable: eqcurry("maybe???"),
 * 	fruit: eqcurry(false)
 * })
 *
 * const apple = makeFruit()
 * const shelf = makeShelf()
 *
 * isThing(shelf) // true
 * isFruit(shelf) // false
 * isShelf(shelf) // true
 *
 * isThing(fruit) // true
 * isFruit(fruit) // true
 * isShelf(fruit) // false
 */
export function structCheck<Type extends object = object>(
	properties: ShapeArg,
	lacks: KeyArray = [],
	optional: KeyArray = [],
	isStrict = false,
): TypePredicate<Type> {
	const props = isArray(properties)
		? Array.from(new Set(properties))
		: keys(properties)
	const propsPredicateArrays = isArray(properties) ? [] : values(properties)
	return (x: any): x is Type => {
		if (
			!(
				isStruct(x) &&
				props.every((p) => p in x) &&
				lacks.every((p) => !(p in x)) &&
				propsPredicateArrays.every((pred, i) => (pred || T)(x[props[i]]))
			)
		)
			return false

		if (!isStrict) return true

		const currKeys = keys(x)
		const keyslen = keys(x).length
		const proplen = props.length
		if (proplen === keyslen) return true
		if (keyslen - proplen > optional.length) return false

		const difference = Array.from(new Set(currKeys).difference(new Set(props)))
		return difference.every((key) => optional.includes(key))
	}
}

/**
 * Returns the list of keys of a given object [includes the prototypes]
 */
export function keys(object: object): FinalKeys {
	const props: FinalKeys = recursiveStringKeys(object)
	props.push(...recursiveSymbolKeys(object))
	return props
}

/**
 * Returns the array of object values [includes the prototypes]
 */
export function values(object: object) {
	const vals: any[] = recursiveStringValues(object)
	vals.push(...recursiveSymbolValues(object))
	return vals
}

/**
 * Returns the array of string keys of a given object [includes the prototypes]
 */
export function recursiveStringKeys(object: object) {
	const props: string[] = []
	for (const p in object) props.push(p)
	return props
}

/**
 * Returns the array of values of a given object at string keys [includes the prototypes]
 */
export function recursiveStringValues(object: object) {
	const props: any[] = []
	for (const p in object) props.push(object[p])
	return props
}

/**
 * Returns the array of symbol keys of a given object [includes the prototypes]
 */
export function recursiveSymbolKeys(object: object) {
	const symbolProperties = Object.getOwnPropertySymbols(object)
	let proto: object
	while ((proto = prototype(object)))
		symbolProperties.push(...Object.getOwnPropertySymbols((object = proto)))
	return symbolProperties
}

/**
 * Returns the array of values of a given object at symbol keys [includes the prototypes]
 */
export const recursiveSymbolValues = (object: object) =>
	recursiveSymbolKeys(object).map((key) => object[key])

/**
 * Returns the pair of own keys and own properties of a given object
 */
export const ownProperties = (object: object): [FinalKeys, any[]] => [
	ownKeys(object),
	ownValues(object),
]

/**
 * Returns the own keys of a given object
 */
export function ownKeys(object: object) {
	const keys: (string | symbol)[] = Object.getOwnPropertyNames(object)
	keys.push(...Object.getOwnPropertySymbols(object))
	return keys
}

/**
 * Returns the own values of a given object
 */
export function ownValues(object: object) {
	return ownKeys(object).map((key) => object[key])
}

/**
 * Alias of 'Object.getPrototypeOf'
 */
export const prototype = Object.getPrototypeOf

/**
 * Makes a shallow copy of a given object
 */
export const copy = <T extends object = object>(x: T) => ({ ...x })

/**
 * Returns the object containing all the property descriptors on a given object `object` [includes the prototypes, respects inheritance],
 * up to the point of meeting the object of `commonPrototype` in the prototype chain (defaults to `Object.prototype`).
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
			...findOwnMissing(
				final,
				Object.getOwnPropertyDescriptors(
					(currPrototype = prototype(currPrototype)),
				),
			),
		}

	return final
}

/**
 * Returns a new object containing all the own properties of `atobj` not present in `inobj`
 */
export function findOwnMissing(inobj: object, atobj: object) {
	const final: object = empty()
	for (const x of ownKeys(atobj)) if (!(x in inobj)) final[x] = atobj[x]
	return final
}

/**
 * Allocates a new empty array
 */
export const empty = () => ({})

/**
 * Creates a function that returns the shallow copy of `object` [useful for preserving the object's]
 */
export const allocator =
	<T extends object = object>(object: T) =>
	() =>
		copy(object)

/**
 * Returns whether the two given objects are the same up to direct equivalence of keys' names,
 * and equivalence of values' arrays via 'array.same' with `pred` predicate
 */
export const same = (
	x: object,
	y: object,
	pred?: (x?: any, y?: any, i?: number) => boolean,
) => array_same(keys(x), keys(y)) && array_same(values(x), values(y), pred)

/**
 * Recursively compares the two objects `x` and `y`, applying
 * `pred(x[i], y[i], i)` on all the values of `x` and `y` that aren't objects themselves.
 *
 * `pred` defaults to `equals`
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
 * Returns a copy of a given object without the provided properties `props`
 */
export function withoutProperties(...props: ObjectKey[]) {
	const propsSet = new Set(props)
	return function (object: object) {
		const newObj: object = empty()
		for (const prop of keys(object))
			if (!propsSet.has(prop)) newObj[prop] = object[prop]
		return newObj
	}
}

/**
 * Returns a function for obtaining `x[name]`
 */
export const prop =
	(name: string) =>
	(x: object): any =>
		x[name]

/**
 * Alias of 'Object.defineProperty'
 */
export const propDefine = Object.defineProperty

/**
 * Alias of 'Object.defineProperties'
 */
export const propsDefine = Object.defineProperties

/**
 * Defines a property with a name `name` and value described by the property-descriptor `value`
 * on the `Extended.prototype`
 */
export const protoProp = (
	Extended: Constructor,
	name: PropertyKey,
	value: PropertyDescriptor,
) => propDefine(Extended.prototype, name, value)

/**
 * Defines the properties described by the given property-descriptor-map `properties` on `Extended.prototype`
 */
export const extendPrototype = (
	Extended: Constructor,
	properties: PropertyDescriptorMap,
) => propsDefine(Extended.prototype, properties)

export * as classes from "./classes.js"
export * as descriptor from "./descriptor.js"
