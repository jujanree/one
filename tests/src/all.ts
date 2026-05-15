import { fork } from "node:child_process"
import { readdirSync } from "node:fs"
import { basename } from "path"

function forkSync(modulePath: string, i = 0) {
	return new Promise((resolve: (value: number | null) => void, _reject) => {
		console.log(`\n\n${i} (${basename(modulePath)}):`)
		const child = fork(modulePath, { stdio: "inherit" })
		child.on("close", (code) => resolve(code))
	})
}

const codes: number[] = []
const modules = readdirSync(`${import.meta.dirname}/modules`)
for (let i = 0; i < modules.length; ++i) {
	const testFileName = modules[i]
	const code = await forkSync(`modules/${testFileName}`, i)
	if (code) codes.push(code)
}
if (codes.length) process.exit(1)
