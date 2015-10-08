'use strict';

require('mocha');
require('should');
var assert = require('assert');
var Base = require('base-methods');
var plugins = require('./');
var base;

describe('plugins', function() {
  describe('use', function() {
    beforeEach(function() {
      base = new Base();
      base.use(plugins);
    });

    it('should expose the use method:', function() {
      assert(base.use);
      assert(typeof base.use === 'function');
    });

    it('should call the function passed to `use`:', function(done) {
      base.use(function (app) {
        assert(app);
        done();
      });
    });

    it('should expose the app instance:', function(done) {
      base.foo = 'bar';
      base.use(function (app) {
        assert(app.foo === 'bar');
        done();
      });
    });

    it('should expose the app instance as "this":', function(done) {
      base.foo = 'bar';
      base.use(function (app) {
        assert(this.foo === 'bar');
        done();
      });
    });

    it('should emit `use`:', function(done) {
      base.on('use', function () {
        done();
      });

      base.use(function (app) {
      });
    });
  });

  describe('run', function() {
    beforeEach(function() {
      base = new Base();
      base.use(plugins);
    });

    it('should expose the run method:', function() {
      assert(base.run);
      assert(typeof base.run === 'function');
    });

    it('should run all registered plugins:', function() {
      var config = {};

      function letter(ch, val) {
        return function(app) {
          return function(config) {
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
    });

    it('should push returned functions onto `plugins`:', function(done) {
      base.use(function() {
        return function() {
        };
      });
      assert(base.plugins.length === 1);
      done();
    });

    it('should run all stored plugins:', function(done) {
      base.use(function(app) {
        return function(config) {
          app.foo = config.foo;
        };
      });

      var config = {foo: 'bar'};
      base.run(config);
      assert(base.foo === 'bar');
      done();
    });

    it('should call the `use` method on the object passed to run:', function(done) {
      base.use(function() {
        return function(config) {
          config.a = 'a';
        };
      });
      base.use(function() {
        return function(config) {
          config.b = 'b';
        };
      });
      base.use(function() {
        return function(config) {
          config.c = 'c';
        };
      });

      var config = new Base();
      base.run(config);
      assert(config.a === 'a');
      assert(config.b === 'b');
      assert(config.c === 'c');
      done();
    });
  });
});
