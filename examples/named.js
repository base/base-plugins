'use strict';

var plugins = require('..');
var Base = require('base');
var app = new Base();
app.type = 'app';
app.use(plugins());
var count = 0;

app.use('foo', function() {
  console.log('foo');
});

app.use('bar', function() {
  console.log('bar');
});

app.use('baz', function() {
  console.log('baz');
});

var foo = new Base();
foo.type = 'foo';
foo.parent = app;
app.run(foo);

var bar = new Base();
bar.type = 'bar';
bar.parent = foo;
foo.run(bar);

var baz = new Base();
baz.type = 'baz';
baz.parent = bar;
bar.run(baz);

