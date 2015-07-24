'use strict'

var dtypeOf = require('compute-dtype')
var getCtor = require('compute-array-constructors')

module.exports = IntegratorFactory

var Integrator = function Integrator( y0, deriv, t, dt ) {
  // Bind variables to this:
  this.deriv = deriv
  this.y = y0
  this.n = this.y.length
  this.dt = dt
  this.t = t

  // Create a scratch array into which we compute the derivative:
  this._dtype = dtypeOf( this.y )
  this._ctor = getCtor( this._dtype )
  this._yp = new this._ctor( this.n )
  this._y1 = new this._ctor( this.n )
}

Integrator.prototype.step = function() {

  this.deriv( this._yp, this.y, this.t )

  for(var i=0; i<this.n; i++) {
    this._y1[i] = this.y[i] + this._yp[i] * this.dt * 0.5
  }

  this.deriv( this._yp, this._y1, this.t + this.dt * 0.5 )

  for(var i=0; i<this.n; i++) {
    this.y[i] += this._yp[i] * this.dt
  }

  this.t += this.dt
  return this
}

Integrator.prototype.steps = function( n ) {
  for(var step=0; step<n; step++) {
    this.step()
  }
  return this
}

function IntegratorFactory( y0, deriv, t, dt ) {
  return new Integrator( y0, deriv, t, dt )
}
