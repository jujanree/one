## Function Types Update

### General

1. improving test coverage
2. improving poorly-worded jsdoc

### Added:

1. proper support for `readonly T[]` array types for non-mutating functions
2. proper support for function-param generics for many functions
3. string:
	1. id:
		1. camelCase
    2. PascalCase
    3. kebabcase
    4. snake_case
    5. MACRO_CASE
    6. flatcase
    7. TRAIN_CASE
    8. HttpCase
4. boolean:
	1. geq
	2. ge
	3. le
	4. leq
5. number:
	1. isPositive
	2. isNegative
	3. isZero
6. map:
	1. keys
	2. values
7. array:
	1. fill
	2. from
	3. repeat
	4. zeros
	5. difference
	6. ArraySet
8. object:
	1. descriptor - replacing completely with a new version (based off composition)
	2. classes:
		1. attachConst
		2. attachGetter
	3. recursiveIterate
	4. Shape
9. types:
	1. verifyConstructor
	2. verifyAbstractConstructor
	3. AbstractConstructor
	4. MapReturnType
	5. BasicFunction
	6. AnyFunction
	7. ArrayMapper
	8. isIterable
10. testing (new module):
	1. assertThrowing
	2. assertForEach
	3. assertGreaterThan
	4. assertLessThan
	5. Range

### Breaking:

1. this version forbids certain previously possible (but dubious) mutating behaviours on type-level
2. renaming submodule `type` to `types` (no need for forced aliasing anymore)
3. enforcing the call to `types.verifyConstructor` to work with non-class constructors (cleaner and more concrete types then)
4. renaming `array.uniqueArr` to `array.unique` (breaking imports)
5. removing `array.propPreserve` (breaking the code that uses it)
6. moving `Constructor` type to `types` (breaking imports)
7. removing `array.tuple` (reason: little utility)
8. renaming `array.out` to `array.without` (breaking imports)
9. removing `array.sort` (reason: little utility)
10. completely replacing the `object.descriptor` submodule (breaking imports)
11. fix: adding the non-enumerable strings into `object.keys()` result (change of behaviour in old code)
12. removing `object.recursiveStringValues` and `object.recursiveSymbolValues` (breaking imports; reason: redundant)
13. replacing `object.structCheck` with `object.Shape` (breaking imports; reason: cleaner to use)
14. renaming various other functions
15. removing `object.ownValues` (reason: redundant)
