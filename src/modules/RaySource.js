import { Vec2 } from "./math";
import Ray from './Ray'

class RaySource {
  constructor(x,y, ctx) {
    this.ctx = ctx
    this.pos = new Vec2(x,y)
    this.rays = []
    const {posX,posY} = this.pos
    for (let i = 0; i < 360; i += 30) {
      this.rays.push(new Ray(posX, posY, i))
    }
    this.points = []
  }

  setPosition(x,y) {
    this.pos.setVec(x,y)
    this.rays.forEach(ray => {
      ray.setPosition(x,y)
    })
  }

  cast(boundaries) {
    this.points = []
    this.rays.forEach(ray => {
      let shortestDistance = Infinity
      let closestPoint = null
      boundaries.forEach(boundary => {
        const point = ray.cast(boundary)
        if (point) {
          let distance = point.distance(this.pos)
          if (distance < shortestDistance) {
            closestPoint = point
            shortestDistance = distance
          }
        }
      })
      if (closestPoint) {
        this.points = [
          ...this.points,
          closestPoint
        ]
      }
    })
  }

  draw() {
    const { ctx, pos: {x: posX, y: posY}} = this
    // this.rays.forEach(ray => ray.draw(ctx))
    this.points.forEach(({x, y}) => {
      ctx.beginPath()
      ctx.moveTo(posX,posY)
      ctx.lineTo(x,y)
      ctx.stroke()
    })
  }
}

export default RaySource
