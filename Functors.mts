const { feft, right, Either, Task } = require("fp-ts/Either")

const { List, Map } = require("immutable-ext");

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
console.log("Id functor:");
const Id = (m) => ({
  extract: () => m,
  // empty: () => m.empty(),
  concat: (om) => Id(m.concat(om.extract())),
});
Id.of = (m) => Id(m);
// Id.empty = (m) => Id(m.empty()); // Must implement empty reference inside monoids to work

let result = Id(Sum(3)).concat(Id(Sum(4))); // 7
console.log("Id", result.extract());

result = Id(Prod(3)).concat(Id(Prod(4))); // 12
console.log("Id", result.extract());

result = List.of(Id(Sum(1)), Id(Sum(2)), Id(Sum(3)))
  .map((x) => x.extract())
  .reduce((ac, m) => ac.concat(m), Sum(1)); // 7
console.log("Id", result);

result = List.of(Id(Sum(1)), Id(Sum(2)), Id(Sum(3))).fold();  // 6
// result = List.of(Id(Sum(1)), Id(Sum(2)), Id(Sum(3))).fold(Id(Sum(1)));  // 7
// result = List.of(Id(Sum(1)), Id(Sum(2)), Id(Sum(3))).fold(Id(Prod(3))); // 12    : Whats?! :)
console.log("Id", result.extract());

// Either functor
console.log("Either(Left, Right) functor:");
const Right = (m) => ({
  isRight: true,
  extract: () => m,
  concat: (om) => 
    om.isRight ? Right(m.concat(om.extract())) : om,
});
Right.of = (m) => Right(m);

const Left = (m) => ({
  isRight: false,
  extract: () => m,
  concat: (om) => 
    Left(m),
    // Left(!om.isRight ? om.extract() : m),
    // Left(!om.isRight ? m.concat(om.extract()) : m),
});
Left.of = (m) => Left(m);

result = Right('Hello ').concat(Right('world'))
console.log("Right", result.extract());
result = Right('Hello ').concat(Left('crul ')).concat(Right('world ')).concat(Left('crul! '))
console.log("Left", result.extract());
result = List.of(Right('Hello '), Left('crul '), Right('world '), Left('crul! ')).fold();
console.log("Left", result.extract());


// Alternative functor
console.log("Alternative functor:");
const Alternative = (m) => ({
  m,
  extract: () => m.extract(),
  concat: (om) => 
    Alternative(om.m.isRight ? m.concat(om.m) : m),
});
Right.of = (m) => Right(m);

result = Alternative(Right('ok 1 '))
  .concat(Alternative(Left('fail 1 ')))
  .concat(Alternative(Right('ok 2 ')))
  .concat(Alternative(Left('fail 2 ')));
// result = List.of(Right('ok 1'), Left('fail 1'), Right('ok 2'), Left('fail 2')).fold();
console.log("Alt", result.extract());
// console.log("Alt", result);


console.log("Functors");
// */
