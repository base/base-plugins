'use strict';

require('mocha');
require('should');
var assert = require('assert');
var Base = require('base');
var plugins = require('./');
var base;

describe('plugins', function() {
  describe('use', function() {
    beforeEach(function() {
      base = new Base();
      base.use(plugins());
    });

    it('should add a `fns` property:', function() {
      assert(base.fns);
      assert(Array.isArray(base.fns));
    });

    it('should ensure the instance has the `fns` property:', function() {
      base = new Base();
      delete base.fns;
      assert(!base.fns);
      base.use(plugins());
      assert(base.fns);
      assert(Array.isArray(base.fns));
    });

    it('should ensure a plain object has the `fns` property:', function() {
      var obj = {};
      plugins()(obj);
      assert(obj.fns);
      assert(Array.isArray(obj.fns));
    });

    it('should ensure a plain object has a "use" method:', function() {
      var obj = {};
      plugins()(obj);
      assert(obj.use);
      assert.equal(typeof obj.use, 'function');
    });

    it('should not overwrite an existing `fns` property:', function() {
      base = new Base();
      base.fns = [function() {}];
      base.use(plugins());
      assert(base.fns);
      assert(Array.isArray(base.fns));
      assert.equal(base.fns.length, 1);
    });

    it('should call the function passed to `use`:', function(cb) {
      base.use(function(app) {
        assert(app);
        cb();
      });
    });

    it('should expose the app instance:', function(cb) {
      base.foo = 'bar';
      base.use(function(app) {
        assert.equal(app.foo, 'bar');
        cb();
      });
    });

    it('should expose the app instance as "this":', function(cb) {
      base.foo = 'bar';
      base.use(function(app) {
        assert.equal(this.foo, 'bar');
        cb();
      });
    });

    it('should emit `use`:', function(cb) {
      base.on('use', function() {
        cb();
      });

      base.use(function(app) {
      });
    });
  });

  describe('named plugins', function() {
    it('should register named plugins', function() {
      var app = new Base();
      app.use(plugins());
      app.type = 'app';
      app.use(plugins());
      var names = [];

      app.use('foo', function() {
        names.push(this.type);
      });

      app.use('bar', function() {
        names.push(this.type);
      });

      app.use('baz', function() {
        names.push(this.type);
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

      assert.deepEqual(names, ['foo', 'bar', 'baz']);
    });

  });

  describe('run', function() {
    beforeEach(function() {
      base = new Base();
      base.use(plugins());
    });

    it('should expose the run method:', function() {
      assert(base.run);
      assert.equal(typeof base.run, 'function');
    });

    it('should run all registered plugins:', function(cb) {
      var config = {};
      var called = 0;

      function letter(ch, val) {
        return function(app) {
          return function(config) {
            called++;
            config[ch] = val;
          };
        };
      }

      base.use(letter('a', 'b'));
      base.use(letter('c', 'd'));
      base.use(letter('e', 'f'));

      base.run(config);

      assert(config.a);
      assert(config.c);
      assert(config.e);
      assert.equal(called, 3);
      cb();
    });

    it('should push returned functions onto `plugins`:', function(cb) {
      base.use(function() {
        return function() {
        };
      });
      assert.equal(base.fns.length, 1);
      cb();
    });

    it('should run all stored plugins:', function(cb) {
      var called = 0;
      base.use(function(app) {
        return function(config) {
          called++;
          app.foo = config.foo;
        };
      });

      var config = {foo: 'bar'};
      base.run(config);
      assert.equal(base.foo, 'bar');
      assert.equal(called, 1);
      cb();
    });

    it('should not run on non-object values', function(cb) {
      var called = 0;
      base.use(function(app) {
        return function(config) {
          called++;
          app.foo = config.foo;
        };
      });

      base.run('foo');
      assert.equal(called, 0);
      cb();
    });

    it('should call the `use` method on the object passed to run:', function(cb) {
      base
        .use(function() {
          return function(config) {
            config.a = 'a';
          };
        })
        .use(function() {
          return function(config) {
            config.b = 'b';
          };
        })
        .use(function() {
          return function(config) {
            config.c = 'c';
          };
        });

      var config = new Base();
      base.run(config);
      assert.equal(config.a, 'a');
      assert.equal(config.b, 'b');
      assert.equal(config.c, 'c');
      cb();
    });
  });
});
