import assert from "node:assert"

export function assertThrows(callback: () => void) {
	let failed = false

	try {
		callback()
		failed = true
	} catch {}

	assert(!failed)
}