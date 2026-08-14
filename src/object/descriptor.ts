/**
 * Returns a `{ enumerable: true }` property descriptor
 */
export const Enumerable = (): PropertyDescriptor => ({ enumerable: true })

/**
 * Returns a non-enumerable, non-configurable, non-writable, getter-only property descriptor
 */
export const Getter = <T = any>(get: () => T): PropertyDescriptor => ({
	get,
})

/**
 * Returns a `{ writable: true }` property descriptor
 */
export const Writable = (): PropertyDescriptor => ({
	writable: true,
})

/**
 * Returns a `{ value }` property descriptor
 */
export const Value = <T = any>(value: T): PropertyDescriptor => ({ value })

/**
 * Returns a `{ configurable: true }` property descriptor
 */
export const Configurable = (): PropertyDescriptor => ({ configurable: true })

/**
 * Returns a `{ set }` property descriptor
 */
export const Setter = <T = any>(
	set: (newValue: T) => void,
): PropertyDescriptor => ({ set })
