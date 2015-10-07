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
  });
});
