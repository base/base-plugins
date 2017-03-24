'use strict';

var plugins = require('..');
var Base = require('base');
var Vinyl = require('vinyl');

function App(files) {
  Base.call(this);
  this.use(plugins()); // register base-plugins
  this.files = files || {};
}
// inherit Base
Base.extend(App);
App.prototype.setFile = function(key, file) {
  this.run(file); // run plugins on `file`
  this.files[key] = file;
  return this;
};
App.prototype.getFile = function(key) {
  return this.files[key];
};

var app = new App();
app.setFile('foo', new Vinyl({path: 'foo'}));
app.setFile('bar', new Vinyl({path: 'bar'}));
app.setFile('baz', new Vinyl({path: 'baz'}));
console.log(app);

function somePlugin(app) {
  return function(file) {
    // add an `options` object to `file`
    file.options = {foo: 'bar'};
  }
}

var app = new App();
app.use(somePlugin);
app.setFile('foo', new Vinyl({path: 'foo'}));
app.setFile('bar', new Vinyl({path: 'bar'}));
app.setFile('baz', new Vinyl({path: 'baz'}));

var file = app.getFile('foo');
console.log(file.options);
//=> {foo: 'bar'}
