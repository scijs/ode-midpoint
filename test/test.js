'use strict';

var midpoint = require('../lib');
var assert = require('chai').assert;

describe("midpoint integration", function() {

  var integrator, f, y0;

  beforeEach(function() {
    f = function(dydt, y) {
      dydt[0] = -y[1];
      dydt[1] =  y[0];
    };

    y0 = new Float64Array([1,0]);

    integrator = midpoint( y0, f, 0, 1 );
  });

  it("takes a single timestep",function() {
    integrator.step();
    assert.closeTo( integrator.y[0], 0.5, 1e-4 );
    assert.closeTo( integrator.y[1], 1, 1e-4 );
  });

  it("takes multiple timesteps",function() {
    integrator.steps(2);
    assert.closeTo(integrator.y[0], -0.75, 1e-4 );
    assert.closeTo(integrator.y[1], 1, 1e-4);
  });

});
