// const { Id, Either, Task } = require("fp-ts/lib")
// const { Leth, Rigth } = Either

const { List, Map } = require('immutable-ext')

// const { Sum } = import("../Study/Monoids");
// Sum
const Sum = (x) => ({
  x,
  concat: (other) => Sum((x += other.x)),
});
Sum.empty = () => Sum(0);

// Prod
const Prod = (x) => ({
  x,
  concat: (other) => Prod((x *= other.x)),
});
Prod.empty = () => Prod(1);

// Id functor
const Id = (m) => ({
  extract: () => m,
  concat: (om) => Id(m.concat(om.extract())),
});
Id.of = (m) => Id(m);

let result = Id.of(Sum(3)).concat(Id.of(Sum(4)));
console.log("Id", result.extract());
result = Id.of(Prod(3)).concat(Id.of(Prod(4)));
console.log("Id", result.extract());
result = List.of(Id.of(Sum(1)), Id.of(Sum(2)), Id.of(Sum(3))).map(x => x.extract()).reduce((ac, m) => ac.concat(m), Sum.empty());
console.log("Id", result);
result = List.of(Id.of(Sum(1)), Id.of(Sum(2)), Id.of(Sum(3))).fold();
console.log("Id", result.extract());

console.log("Functors");
