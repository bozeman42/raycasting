import { Vec2 } from "./math";
import Ray from './Ray'

class RaySource {
  constructor(x,y, ctx) {
    this.ctx = ctx
    this.pos = new Vec2(x,y)
    this.rays = []
    const {posX,posY} = this.pos
    for (let i = 0; i < 360; i += .1) {
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
    const { ctx, pos} = this
    // this.rays.forEach(ray => ray.draw(ctx))
    this.points.forEach((point) => {
      const { x, y } = point
      ctx.beginPath()
      const value = pos.distance(point)
      const distance = value > 10 ? value : 10
      const intensity = mapIntensity(distance)
      ctx.strokeStyle = `RGB(${intensity},${intensity},0)`
      ctx.rect(x,y,1,1)
      ctx.stroke()
    })
  }
}

function mapIntensity(distance) {
  return 255 / Math.pow(distance / 150, 2)
}

export default RaySource
