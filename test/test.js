'use strict'

var midpoint = require('../lib')
  , assert = require('chai').assert
  , richardson = require('richardson-extrapolation')

var ctors = {
  'float32': Float32Array,
  'float64': Float64Array,
  'array': function(){ return arguments[0] }
}


Object.keys(ctors).forEach(function(dtype) {
  var ctor = ctors[dtype]

  describe('midpoint integration (' + dtype + ')', function() {

    describe('integration of one variable', function() {
      var integrator, f, y0, t0, n

      beforeEach(function() {
        f = function(dydt, y) { dydt[0] = -y[0] }
        t0 = 1.5
        y0 = new ctor([1])
        n = 10

        integrator = midpoint( y0, f, t0, 1/n )
      })

      it('creates work arrays of the same size as the input',function() {
        assert.equal( integrator._k1.constructor, y0.constructor )
        assert.equal( integrator._k2.constructor, y0.constructor )
      })

      it('creates work arrays of the same type as the input',function() {
        assert.equal( integrator._k1.length, y0.length )
        assert.equal( integrator._k2.length, y0.length )
      })

      it('takes multiple timesteps',function() {
        integrator.steps(n)
        assert.closeTo(integrator.y[0], Math.exp(-1), 1e-3 )
      })
    })


    describe('integration of two variables', function() {
      var integrator, f, y0, t0

      beforeEach(function() {
        f = function(dydt, y) {
          dydt[0] = -y[1]
          dydt[1] =  y[0]
        }

        t0 = 1.5
        y0 = new ctor([1,0])

        integrator = midpoint( y0, f, t0, 1 )
      })

      it('creates work arrays of the same size as the input',function() {
        assert.equal( integrator._k1.constructor, y0.constructor )
        assert.equal( integrator._k2.constructor, y0.constructor )
      })

      it('creates work arrays of the same type as the input',function() {
        assert.equal( integrator._k1.length, y0.length )
        assert.equal( integrator._k2.length, y0.length )
      })

      it('increments the time',function() {
        integrator.step()
        assert.closeTo( integrator.t, t0 + integrator.dt, 1e-4 )
        integrator.step()
        assert.closeTo( integrator.t, t0 + 2*integrator.dt, 1e-4 )
      })

      it("takes a single timestep",function() {
        integrator.step()
        assert.closeTo( integrator.y[0], 0.5, 1e-4 )
        assert.closeTo( integrator.y[1], 1, 1e-4 )
      })

      it("takes multiple timesteps",function() {
        integrator.steps(2)
        assert.closeTo(integrator.y[0], -0.75, 1e-4 )
        assert.closeTo(integrator.y[1], 1, 1e-4)
      })

    })

    describe('convergence', function() {

      it('local truncation error is order O(h^3)', function() {
        var result = richardson(function(h) {

          // Integrate along a sector of a circle:
          var f = function(dydt, y) { dydt[0] = -y[1]; dydt[1] =  y[0] }
          var i = midpoint( new ctor([1,0]), f, 0, h ).step()

          // Return the distance from the expected endpoint:
          return Math.sqrt( Math.pow(i.y[0]-Math.cos(h),2) + Math.pow(i.y[1]-Math.sin(h),2) )

        }, 2*Math.PI/20, { f: 0 } )

        assert.closeTo( result.n, 3, 1e-2, 'n ~ 3' )
      })

      it('total accumulated error is order O(h^2)', function() {

        var result = richardson(function(h) {

          // Integrate around a circle with this step size:
          var f = function(dydt, y) { dydt[0] = -y[1]; dydt[1] =  y[0] }
          var i = midpoint( new ctor([1,0]), f, 0, h ).steps( Math.floor(2*Math.PI/h + 0.5) )

          // Return the distance from the expected endpoint:
          return Math.sqrt( Math.pow(i.y[0]-1,2) + Math.pow(i.y[1],2) )

        }, 2*Math.PI/40, { f: 0 } )

        assert.closeTo( result.n, 2, 1e-2, 'n ~ 2' )
      })

    })

  })

})
