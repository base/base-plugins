'use strict';

var plugins = require('..');
var Base = require('base');
var app = new Base();
app.use(plugins());
var count = 0;

function plugin(parent) {
  if (this._ran) return;
  this._ran = true;
  console.log(this);
  count++;
  return function() {
    if (this._ran) return;
    this._ran = true;
    console.log(this);
    count++;
    return function() {
      if (this._ran) return;
      this._ran = true;
      console.log(this);
      count++;
    };
  };
}

app.use(plugin);
app.use(plugin);
app.use(plugin);
app.use(plugin);
console.log();
console.log(app.fns);
console.log();
var abc = {foo: 'bar'};
var xyz = {baz: 'qux'};

app.run(abc);
app.run(abc);
app.run(abc);
app.run(abc);

abc.run(xyz);
abc.run(xyz);
abc.run(xyz);
abc.run(xyz);
// console.log(abc);
console.log(count);
