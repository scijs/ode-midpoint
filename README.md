# ode-midpoint [![Build Status](https://travis-ci.org/scijs/ode-midpoint.svg)](https://travis-ci.org/scijs/ode-midpoint) [![npm version](https://badge.fury.io/js/ode-midpoint.svg)](http://badge.fury.io/js/ode-midpoint) [![Dependency Status](https://david-dm.org/scijs/ode-midpoint.svg)](https://david-dm.org/scijs/ode-midpoint)

> Integrate a system of ODEs using the Second Order Runge-Kutta (Midpoint) method


## Introduction

This module integrates a system of ordinary differential equations of the form <p align="center"><img alt="undefined" valign="middle" src="images/yt-ft-yt-fae25965d3.png" width="151.5" height="25"></p> <p align="center"><img alt="undefined" valign="middle" src="images/yt_0-y_0-42d14f447f.png" width="91.5" height="24"></p> where <img alt="undefined" valign="middle" src="images/y-adb83ba1d7.png" width="14.5" height="16.5"> is a vector of length <img alt="undefined" valign="middle" src="images/n-66e1b1ee17.png" width="16" height="13">. Given time step <img alt="undefined" valign="middle" src="images/delta-t-9813ae7971.png" width="28" height="18">, the midpoint method integrates the ODE with update <p align="center"><img alt="undefined" valign="middle" src="images/y_n1-y_n-delta-t-fleft-t_n-fracdelta-t2-y_n-f-0a92f940fc.png" width="416.5" height="52"></p>

## Install

```bash
$ npm install ode-midpoint
```

## Example

```javascript
var midpoint = require('ode-midpoint')

var deriv = function(dydt, y, t) {
  dydt[0] = -y[1]
  dydt[1] =  y[0]
}

var y0 = [1,0]
var n = 1000
var t0 = 0
var dt = 2.0 * Math.PI / n

var integrator = midpoint( y0, deriv, t0, dt )

// Integrate 1000 steps:
integrator.steps(n)

// Integrate all the way around a circle:
// => integrator.y = [ 1.0199349143076457, -0.00008432969374211775 ]
```



## API

### `require('ode-midpoint')( y0, deriv, t0, dt )`
**Arguments:**
- `y0`: an array or typed array containing initial conditions. This vector is updated in-place with each integrator step.
- `deriv`: a function that calculates the derivative. Format is `function( dydt, y, t )`. Inputs are current state `y` and current time `t`, output is calcualted derivative `dydt`.
- `t0`: initial time <img alt="undefined" valign="middle" src="images/t-3f19307093.png" width="11.5" height="16.5">.
- `dt`: time step <img alt="undefined" valign="middle" src="images/delta-t-9813ae7971.png" width="28" height="18">.

**Returns**:
Initialized integrator object.

**Properties:**
- `n`: dimension of `y0`.
- `y`: current state. Initialized as a shallow copy of input `y0`.
- `deriv`: function that calcualtes derivative. Initialized from input. May be changed.
- `t`: current time, incremented by `dt` with each time step.
- `dt`: time step <img alt="undefined" valign="middle" src="images/delta-t-9813ae7971.png" width="28" height="18">. Initialized from input `dt`. May be changed.

**Methods:**
- `.step()`: takes a single step of the midpoint integrator and stores the result in-place in the `y` property.
- `.steps( n )`: takes `n` steps of the midpoint integrator, storing the result in-place in the `y` property.

## Credits

(c) 2015 Ricky Reusser. MIT License