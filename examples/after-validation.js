'use strict';

var plugins = require('..');
var Base = require('base');
var app = new Base();
app.use(plugins());
var count = 0;

function ran(obj) {
  if (obj._ran) return true;
  obj._ran = true;
}

function plugin(parent) {
  if (ran(this)) return;
  console.log(this);
  count++;
  return function() {
    if (ran(this)) return;
    console.log(this);
    count++;
    return function() {
      if (ran(this)) return;
      console.log(this);
      count++;
    };
  };
}

app.use(plugin);
app.use(plugin);
app.use(plugin);
app.use(plugin);
console.log(app.fns);

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
console.log(count); //=> 84!!!
