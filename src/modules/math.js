const { cos, sin, PI } = Math

export class Vec2 {
  constructor(x = 0, y = 0) {
    this._x = x
    this._y = y
  }

  setByAngLen(angle = 0, length = 1) {
    this._x = length * cos(angle / 360 * 2 * PI)
    this._y = length * sin(angle / 360 * 2 * PI)
    return this
  }

  get x() {
    return this._x
  }
  get y() {
    return this._y
  }

  get angle() {
    return 
  }

  rotate(angle) {
    const { _x, _y } = this
    const { PI, cos, sin } = Math
    const rad = angle * ( PI / 180 )
    this.setVec(_x * cos(rad) - _y * sin(rad), _x * sin(rad) + _y * cos(rad))
    return this
  }

  setVec (x, y) {
    this._x = x,
    this._y = y
    return this
  }

  get coords () {
    return [ this.x, this.y ]
  }

  get magnitude() {
    const { x, y } = this
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y,2))
  }

  set magnitude(length) {
    this.setVec(length * (this._x / this.magnitude), length * (this._y / this.magnitude))
  }

  direction (length = 1) {
    return [
      length * (this._x / this.magnitude),
      length * (this._y / this.magnitude)
    ]
  }

  normalize () {
    this.magnitude = 1
    return this
  }

  difference(vec) {
    return new Vec2(this.x - vec.x, this.y - vec.y)
  }

  distance(vec) {
    return this.difference(vec).magnitude
  }

  translate(x,y) {
    this._x += x
    this._y += y
    return this
  }
}