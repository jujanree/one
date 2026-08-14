## Function Types Update

### Added:

1. proper support for `readonly T[]` array types
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
8. object:
   1. descriptor - replacing completely with a new version (based off composition)
   2. classes:
      1. attachConst
      2. attachGetter
9. types:
   1. verifyConstructor
   2. verifyAbstractConstructor
   3. AbstractConstructor
   4. MapReturnType
   5. BasicFunction
   6. AnyFunction
   7. ArrayMapper

### Breaking:

1. this version forbids certain previously possible (but dubious) mutating behaviours on type-level
2. renaming submodule `type` to `types` (no need for forced aliasing anymore)
3. enforcing the call to `types.verifyConstructor` to work with non-class constructors (cleaner and more concrete types then)
4. renaming `array.uniqueArr` to `array.unique` (breaking imports)
5. removing `array.propPreserve` (breaking the code that uses it)
6. moving `Constructor` type to `types` (breaking imports)
7. removing `array.tuple` (little utility)
8. renaming `array.out` to `array.without` (breaking imports)
9. removing `array.sort` (little utility)
10. completely replacing the `object.descriptor` submodule
