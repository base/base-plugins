'use strict';

var plugins = require('./');
var Base = require('base');
Base.use(plugins());

function plugin(options) {
  return function(app, base) {
    console.log(base.foo);
    //=> 'foo'
  };
}

var a = new Base();
a.foo = 'bar';
a.use(plugin());

var b = new Base();
b.parent = a;
b.use(plugin());

var c = new Base();
c.parent = b;
c.use(plugin());

