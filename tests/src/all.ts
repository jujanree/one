import { fork } from "node:child_process"
import { readdirSync } from "node:fs"

function forkSync(modulePath: string, i = 0) {
	return new Promise((resolve: (value: number | null) => void, _reject) => {
		console.log(`\n\n${i} (${modulePath}):`)
		const child = fork(modulePath, { stdio: "inherit" })
		child.on("close", (code) => resolve(code))
	})
}

function getExtensions(path: string) {
	return path.split(".").slice(1)
}

async function forkSubdir(baseDirName: string) {
	const errcodes: number[] = []
	const modules = readdirSync(`${import.meta.dirname}/${baseDirName}`).filter(
		(x) => !getExtensions(x).includes("map"),
	)

	for (let i = 0; i < modules.length; ++i) {
		const testFileName = modules[i]
		const code = await forkSync(`${baseDirName}/${testFileName}`, i)
		if (code) errcodes.push(code)
	}

	return errcodes
}

const dynamicErrcodes = await forkSubdir("dynamic")
const staticErrcodes = await forkSubdir("static")

const errcodes = dynamicErrcodes.concat(staticErrcodes)
if (errcodes.length) process.exit(1)
