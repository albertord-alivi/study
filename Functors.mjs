// const { Id, Either, Task } = require("fp-ts/lib")
// const { Leth, Rigth } = Either
var _a = require('immutable-ext'), List = _a.List, Map = _a.Map;
// const { Sum } = import("../Study/Monoids");
// Sum
var Sum = function (x) { return ({
    x: x,
    concat: function (other) { return Sum((x += other.x)); }
}); };
Sum.empty = function () { return Sum(0); };
// Prod
var Prod = function (x) { return ({
    x: x,
    concat: function (other) { return Prod((x *= other.x)); }
}); };
Prod.empty = function () { return Prod(1); };
// Id functor
var Id = function (m) { return ({
    extract: function () { return m; },
    concat: function (om) { return Id(m.concat(om.extract())); }
}); };
Id.of = function (m) { return Id(m); };
var result = Id.of(Sum(3)).concat(Id.of(Sum(4)));
console.log("Id", result.extract());
result = Id.of(Prod(3)).concat(Id.of(Prod(4)));
console.log("Id", result.extract());
result = List.of(Id.of(Sum(1)), Id.of(Sum(2)), Id.of(Sum(3))).map(function (x) { return x.extract(); }).reduce(function (ac, m) { return ac.concat(m); }, Sum.empty());
console.log("Id", result);
result = List.of(Id.of(Sum(1)), Id.of(Sum(2)), Id.of(Sum(3))).fold();
console.log("Id", result.extract());
console.log("Functors");
