# base-plugins [![NPM version](https://img.shields.io/npm/v/base-plugins.svg?style=flat)](https://www.npmjs.com/package/base-plugins) [![NPM monthly downloads](https://img.shields.io/npm/dm/base-plugins.svg?style=flat)](https://npmjs.org/package/base-plugins)  [![NPM total downloads](https://img.shields.io/npm/dt/base-plugins.svg?style=flat)](https://npmjs.org/package/base-plugins) [![Linux Build Status](https://img.shields.io/travis/node-base/base-plugins.svg?style=flat&label=Travis)](https://travis-ci.org/node-base/base-plugins)

> Adds 'smart plugin' support to your base application.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save base-plugins
```

**What does this do?**

This plugin augments the generic plugin functionality that ships with [base](https://github.com/node-base/base).

* Without this plugin, any plugins that registered with the `use` method and are only called once upon init.
* With this plugin, other plugins that return a function will be pushed onto a `plugins` array, and can be called again later with the `run` method.

## Usage

```js
var plugins = require('base-plugins');
var Base = require('base');
var base = new Base();

// register the `plugins` plugin
base.use(plugins());
```

## Examples

### .use example

Once the `use` method is called:

1. a `fns` array is added to the instance for storing plugin functions
2. a `run` method is added to the instance for running stored plugins
3. the `use` method is modified so that anytime a function is returned by a plugin, the function will be pushed onto the `fns` array. Aside from that, you shouldn't see any difference in how the `use` method works.

## .run example

The `run` method iterates over the `fns` array and calls each stored plugin function on the given object.

```js
var collection = {};
base.use(function(app) {
  app.x = 'y';
  return function(obj) {
    obj.a = 'b';
  };
});
base.run(collection);

console.log(base.x);
//=> 'y'
console.log(collection.a);
//=> 'b'
```

## API

### [.use](index.js#L54)

Define a plugin function to be called immediately upon init. The only parameter exposed to the plugin is the application instance.

Also, if a plugin returns a function, the function will be pushed
onto the `fns` array, allowing the plugin to be called at a
later point, elsewhere in the application.

**Params**

* `fn` **{Function}**: plugin function to call
* `returns` **{Object}**: Returns the item instance for chaining.

**Example**

```js
// define a plugin
function foo(app) {
  // do stuff
}

// register plugins
var app = new Base()
  .use(foo)
  .use(bar)
  .use(baz)
```

### [.run](index.js#L69)

Run all plugins

**Params**

* `value` **{Object}**: Object to be modified by plugins.
* `returns` **{Object}**: Returns the item instance for chaining.

**Example**

```js
var config = {};
app.run(config);
```

## About

### Related projects

* [base-cli](https://www.npmjs.com/package/base-cli): Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a… [more](https://github.com/node-base/base-cli) | [homepage](https://github.com/node-base/base-cli "Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a few plugins, like 'base-store', 'base-options' and 'base-data'.")
* [base-config](https://www.npmjs.com/package/base-config): base-methods plugin that adds a `config` method for mapping declarative configuration values to other 'base… [more](https://github.com/node-base/base-config) | [homepage](https://github.com/node-base/base-config "base-methods plugin that adds a `config` method for mapping declarative configuration values to other 'base' methods or custom functions.")
* [base-data](https://www.npmjs.com/package/base-data): adds a `data` method to base-methods. | [homepage](https://github.com/node-base/base-data "adds a `data` method to base-methods.")
* [base-fs](https://www.npmjs.com/package/base-fs): base-methods plugin that adds vinyl-fs methods to your 'base' application for working with the file… [more](https://github.com/node-base/base-fs) | [homepage](https://github.com/node-base/base-fs "base-methods plugin that adds vinyl-fs methods to your 'base' application for working with the file system, like src, dest, copy and symlink.")
* [base-option](https://www.npmjs.com/package/base-option): Adds a few options methods to base, like `option`, `enable` and `disable`. See the readme… [more](https://github.com/node-base/base-option) | [homepage](https://github.com/node-base/base-option "Adds a few options methods to base, like `option`, `enable` and `disable`. See the readme for the full API.")
* [base](https://www.npmjs.com/package/base): Framework for rapidly creating high quality node.js applications, using plugins like building blocks | [homepage](https://github.com/node-base/base "Framework for rapidly creating high quality node.js applications, using plugins like building blocks")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.3, on April 01, 2017._