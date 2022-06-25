// Semigroup: Associtive + Clouse   ->   Parallelism
// Monoids: Semigroup + Identity

const { List, Map } = require('immutable-ext')
var _ = require('lodash')
// const { Map } = require('immutable')
// const {Disjunction, Additive} = require('fantasy-monoids')

let result
result = "Hi".concat("!!").concat("*");
console.log(result)

// Sum
const Sum = (x) => ({
  x,
  concat: (other) => Sum(x += other.x),
});
Sum.empty = () => Sum(0);
// export default Sum

// result = Sum(3).concat(Sum(4)).concat(Sum.empty())
// console.log("Result: ", result.x)

// Reducer need a Identity to work with empty list
result = []
  .map(Sum)
  .reduce((acc, n) => (console.log(acc.x, n.x), acc.concat(n)), Sum.empty())
console.log("Result []: ", result.x)

// Prod
const Prod = (x) => ({
  x,
  concat: (other) => Prod(x *= other.x),
});
Prod.empty = () => Prod(1)

// result = Prod(3).concat(Prod(4)).concat(Prod.empty())
// console.log("Result: ", result.x)

// Reducer without map: auto infering acc value 
result = [1, 2, 3]
  .reduce((acc, n) => acc.concat(Prod(n)), Prod.empty())
console.log("Result Prod: ", result.x)

// Any
const Any = (x) => ({
  x,
  concat: (other) => (console.log(`Any ${x}`), Any(x || other.x)),
})
Any.empty = () => Any(false)

result = Any(false).concat(Any(false)).concat(Any(false))
console.log("Result: ", result.x)

result = [false, true, false].reduce((acc, v) => (acc.concat(Any(v))), Any.empty())
console.log("Result: ", result.x)

// All
const All = (x) => ({
  x,
  concat: (other) => (
    All(x && other.x)
  )
})
All.empty = () => All(true)
result = [true, false, true].map(Any).reduce((acc, v) => (acc.concat(v)))  // Do not need .empty() 
console.log("Result: ", result.x)

// Lists:
//   - foldMap -> same as first .map then .reduce
result = List([true, true, false]).foldMap(All, All.empty())
console.log("Result foldMap: ", result.x)

result = List.of([1,2,3], [4,5,6], 7).fold()  // [ 1, 2, 3, 4, 5, 6, 7 ]
result = List.of(true, true, false).fold([])  // [ true, true, false ]
result = new Map({a: "hidy", b: "hidy", c: "ho"}).fold()    // "hidyhidyho"
result = new Map({a: "hidy", b: "hidy", c: "ho"}).fold([])  // [ 'hidy', 'hidy', 'ho' ]
result = new Map({a: Prod(2), b: Prod(4), c: Prod(8)}).fold(Prod.empty()) // { x : 64 concat:... }
result = List.of(1,2,3,4).foldMap(Sum, Sum.empty())
result = new Map({a: 2, b: 4, c: 8}).foldMap(Prod, Prod(2))
console.log("Fold", result)

// result = List.of(
//   Map({a: Sum(1), b: Any(true),  c: "son", d: [1], e: 'wut'}),
//   Map({a: Sum(2), b: Any(false), c: "ofa", d: [2]}),
//   Map({a: Sum(3), b: Any(false), c: "gun", d: [3]})).fold()
// console.log("Multi Fold", result.entries())

// Not monoid example: Interseption -> because not identity ( or simulate miu conjunt )
const Inter = (x) => ({
  x,
  concat: (other) => (
    Inter(_.intersection(x, other.x))
  )
})

result = Inter([1,2,3,4]).concat(Inter([3,4,5,6]))
result = List.of([1,2,3,4],[3,4,5,6]).foldMap(Inter, Inter([3]))
console.log("Inter", result.x)

const Union = (x) => ({
  x,
  concat: (other) => (
    Union(_.union(x, other.x))
  )
})
Union.empty = () => Union([])

result = Union([1,2,3,4]).concat(Union([3,4,5,6]))
result = List.of([1,2,3,4],[3,4,5,6]).foldMap(Union, Union([6]))
console.log("Union", result.x)

// Functors
