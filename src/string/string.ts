import { last, unique } from "../array/array.js"

/**
 * Returns a new string based off `x`, in which the first character is put through `.toUpperCase()`,
 * and the remainder are put through `.toLowerCase()`
 *
 * If `x` is empty, returns empty string
 */
export const capitalize = (x: string = "") =>
	x.length ? `${x[0].toUpperCase()}${x.slice(1).toLowerCase()}` : ""

/**
 * Splits the string using `toExtract`, then joins it using `toReplaceWith`.
 *
 * `toReplaceWith` defaults to `""`
 */
export const extract = (
	string: string,
	toExtract: string | RegExp,
	toReplaceWith: string = "",
) => string.split(toExtract).join(toReplaceWith)

/**
 * Counts the number of (non-intersecting) occurences of `substring` inside `string`
 */
export const count = (string: string, substring: string | RegExp) =>
	string.split(substring).length - 1

/**
 * Creates a function for limiting the `string` with `maxlength` length,
 * and (if the `.length` exceeds the `maxlength`), replacing the end with
 * the `limitor`
 */
export const limit =
	(maxlength: number, limitor = "") =>
	(string: string = "") =>
		`${string.slice(0, Math.min(string.length, maxlength))}${
			string.length > maxlength ? limitor : ""
		}`

/**
 * Returns the entirety of the string, except for the last symbol
 */
export const lastOut = (x: string) => x.slice(0, lastIndex(x))

/**
 * Concatenates the `strings`, and returns the result
 */
export const concat = (...strings: string[]) =>
	strings.reduce((last, curr) => last + curr, "")

/**
 * Performs an algorithm of "covering" on the given strings, and returns the result.
 *
 * Covering on two strings `a, b` returns `a + b.slice(a.length)`,
 * that is, replacing the first `a.length` characters of `b` with `a`,
 * and concatenating the remainder.
 */
export const cover = (...strings: string[]) =>
	strings.reduce(
		(covering: string, covered: string) =>
			`${covering}${covered.slice(covering.length)}`,
		"",
	)

/**
 * A function returning whether the given string is empty.
 */
export const isEmpty = (x: string) => !x.length

/**
 * Returns the last index of a given string
 */
export const lastIndex = (x: string) => x.length - 1

/**
 * Returns `x.charCodeAt(i)`. `i` defaults to 0
 */
export const charCodeAt = (x: string, i: number = 0) => x.charCodeAt(i)

/**
 * Consequently splits the given string `x` using `splitBy` delimiters, and returns the result.
 */
export const multiSplit = (x: string, splitBy: string[]) => {
	let orig = x
	splitBy = unique(splitBy)
	const finalDelim = last(splitBy)
	for (let i = 0; i < splitBy.length - 1; ++i)
		orig = extract(orig, splitBy[i], finalDelim)
	return orig.split(finalDelim)
}

/**
 * Namespace for formatting multi-word string identifiers
 */
export namespace id {
	/**
	 * Formats the words into an id using camelCase.
	 *
	 * Example: `camelCase("something", "wicked", "here") -> "somethingWickedHere"`
	 */
	export const camelCase = (...words: string[]) => {
		if (words.length === 0) return ""
		let result: string = words[0].toLowerCase()
		words.slice(1).forEach((word) => (result += capitalize(word)))
		return result
	}

	/**
	 * Formats the words into an id using PascalCase.
	 *
	 * Example: `PascalCase("something", "wicked", "here") -> "SomethingWickedHere"`
	 */
	export const PascalCase = (...words: string[]) => {
		return words.map((x) => capitalize(x)).join("")
	}

	/**
	 * Formats the words into an id using kebab-case.
	 *
	 * Example: `kebabcase("Something", "WICKED", "here") -> "something-wicked-here"`
	 */
	export const kebabcase = (...words: string[]) => {
		return words.map((x) => x.toLowerCase()).join("-")
	}

	/**
	 * Formats the words into an id using snake_case.
	 *
	 * Example: `snake_case("something", "WickeD", "herE") -> "something_wicked_here"`
	 */
	export const snake_case = (...words: string[]) => {
		return words.map((x) => x.toLowerCase()).join("_")
	}

	/**
	 * Formats the words into an id using MACRO_CASE.
	 *
	 * Example: `MACRO_CASE("something", "wicked", "here") -> "SOMETHING_WICKED_HERE"`
	 */
	export const MACRO_CASE = (...words: string[]) => {
		return words.map((x) => x.toUpperCase()).join("_")
	}

	/**
	 * Formats the words into an id using flatcase.
	 *
	 * Example: `flatcase("Something", "WICKED", "herE") -> "somethingwickedhere"`
	 */
	export const flatcase = (...words: string[]) => {
		return words.map((x) => x.toLowerCase()).join("")
	}

	/**
	 * Formats the words into an id using TRAIN-CASE.
	 *
	 * Example: `TRAIN_CASE("something", "wicked", "here") -> "SOMETHING-WICKED-HERE"`
	 */
	export const TRAIN_CASE = (...words: string[]) => {
		return words.map((x) => x.toUpperCase()).join("-")
	}

	/**
	 * Formats the words into an id using Http-Case.
	 *
	 * Example: `HttpCase("something", "WiCked", "herE") -> "Something-Wicked-Here"`
	 */
	export const HttpCase = (...words: string[]) => {
		return words.map((x) => capitalize(x)).join("-")
	}
}
