import assert from "node:assert"
import { isNumber } from "../types/types.js"

export function assertThrows(callback: () => void) {
	let failed = false

	try {
		callback()
		failed = true
	} catch {}

	assert(!failed)
}

export function assertGreaterThan<T = any>(a: T, b: T) {
	assert(a > b)
}

export function assertLessThan<T = any>(a: T, b: T) {
	assert(a < b)
}

export function assertForEach<T, X extends Iterable<T>>(
	iter: X,
	pred: (x: T, i: number, iter: X) => boolean,
) {
	let i = 0
	for (const x of iter) assert(pred(x, i++, iter))
}

export class Range {
	declare readonly to: number
	declare readonly from: number;

	*[Symbol.iterator]() {
		for (let i = this.from; i < this.to; i += this.step) yield i
	}

	constructor(
		from: number,
		to?: number,
		readonly step: number = 1,
	) {
		if (!isNumber(to)) {
			to = from
			from = 0
		}

		this.from = from
		this.to = to
	}
}
