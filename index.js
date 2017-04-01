/*!
 * base-plugins <https://github.com/node-base/base-plugins>
 *
 * Copyright (c) 2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isRegistered = require('is-registered');
var isValid = require('is-valid-instance');
var define = require('define-property');
var isObject = require('isobject');

module.exports = function plugin() {
  return function fn(app) {
    if (isRegistered(app, 'base-plugins')) return;

    /**
     * Cache plugins
     */

    if (!app.fns) {
      define(app, 'fns', []);
    }

    /**
     * Define a plugin function to be called immediately upon init.
     * The only parameter exposed to the plugin is the application
     * instance.
     *
     * Also, if a plugin returns a function, the function will be pushed
     * onto the `fns` array, allowing the plugin to be called at a
     * later point, elsewhere in the application.
     *
     * ```js
     * // define a plugin
     * function foo(app) {
     *   // do stuff
     * }
     *
     * // register plugins
     * var app = new Base()
     *   .use(foo)
     *   .use(bar)
     *   .use(baz)
     * ```
     * @name .use
     * @param {Function} `fn` plugin function to call
     * @return {Object} Returns the item instance for chaining.
     * @api public
     */

    define(app, 'use', use);

    /**
     * Run all plugins
     *
     * ```js
     * var config = {};
     * app.run(config);
     * ```
     * @name .run
     * @param {Object} `value` Object to be modified by plugins.
     * @return {Object} Returns the item instance for chaining.
     * @api public
     */

    define(app, 'run', function(val) {
      if (!isObject(val)) return;

      if (!val.use) {
        define(val, 'fns', val.fns || []);
        define(val, 'use', use);
      }

      if (!val.fns || val.fns.indexOf(fn) === -1) {
        val.use(fn);
      }

      var len = this.fns.length;
      var idx = -1;
      while (++idx < len) {
        val.use(this.fns[idx]);
      }
      return this;
    });

    return fn;
  };

  /**
   * Call plugin `fn`. If a function is returned push it into the
   * `fns` array to be called by the `run` method.
   */

  function use(type, fn, options) {
    if (typeof type === 'string' || Array.isArray(type)) {
      fn = wrap(type, fn);
    } else {
      options = fn;
      fn = type;
    }

    var val = fn.call(this, this, this.base || {}, options || {}, this.env || {});
    if (typeof val === 'function') {
      this.fns.push(val);
    }

    if (typeof this.emit === 'function') {
      this.emit('use', val, this);
    }
    return this;
  }

  /**
   * Wrap a named plugin function so that it's only called on objects of the
   * given `type`
   *
   * @param {String} `type`
   * @param {Function} `fn` Plugin function
   * @return {Function}
   */

  function wrap(type, fn) {
    return function plugin() {
      if (!isValid(this, type)) return plugin;
      return fn.apply(this, arguments);
    };
  }
};
