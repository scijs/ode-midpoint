'use strict'

var midpoint = require('../lib')
var assert = require('chai').assert

var ctors = {
  'float32': Float32Array,
  'float64': Float64Array,
  'array': function(){ return Array.apply(this,arguments[0]) }
}


Object.keys(ctors).forEach(function(dtype) {
  var ctor = ctors[dtype]

  describe('midpoint integration (' + dtype + ')', function() {

    var integrator, f, y0, t0

    beforeEach(function() {
      f = function(dydt, y) {
        dydt[0] = -y[1]
        dydt[1] =  y[0]
      }

      t0 = 1.5
      y0 = new Float64Array([1,0])

      integrator = midpoint( y0, f, t0, 1 )
    })

    it("takes a single timestep",function() {
      integrator.step()
      assert.closeTo( integrator.y[0], 0.5, 1e-4 )
      assert.closeTo( integrator.y[1], 1, 1e-4 )
    })

    it("increments the time",function() {
      integrator.step()
      assert.closeTo( integrator.t, t0 + integrator.dt, 1e-4 )
      integrator.step()
      assert.closeTo( integrator.t, t0 + 2*integrator.dt, 1e-4 )
    })

    it("takes multiple timesteps",function() {
      integrator.steps(2)
      assert.closeTo(integrator.y[0], -0.75, 1e-4 )
      assert.closeTo(integrator.y[1], 1, 1e-4)
    })

  })
})
