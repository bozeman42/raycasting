import { Vec2 } from './math'
import Boundary from './Boundary'

const INTERVAL = 0.1

class Circle {
  constructor(x,y,radius) {
    this.pos = new Vec2(x,y)
    this.radius = radius
    this.noBreaks = true
    this.boundaries = []
    this.buildCircle()
  }

  draw(ctx) {
    this.boundaries.forEach(boundary => boundary.draw(ctx))
  }

  buildCircle() {
    const { sin, cos, PI } = Math
    const { pos: { x: xPos, y: yPos }, radius: r, noBreaks } = this
    let x = xPos + r*sin(0)
    let y = yPos + r*cos(0)
    let x2, y2
    for (let theta = INTERVAL; theta <= PI * 2; theta += INTERVAL) {
      x2 = xPos + r*sin(theta)
      y2 = yPos + r*cos(theta)
      if (Math.round(theta / INTERVAL) % 2 || noBreaks) {
        this.boundaries.push(new Boundary(x,y,x2,y2))
      }
      x = x2
      y = y2
    }
    x2 = xPos + r*sin(0)
    y2 = yPos + r*cos(0)
    this.boundaries.push(new Boundary(x,y,x2,y2))
  }
}

export default Circle
