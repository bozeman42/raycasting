import { Vec2 } from './math'

class Ray {
  constructor(xPos, yPos, angle = 0, ctx) {
    this.ctx = ctx
    this.angle = angle
    this.position = new Vec2(xPos,yPos),
    this.direction = new Vec2().setByAngLen(this.angle)
  }

  setPosition(x,y) {
    this.position.setVec(x,y)
  }

  draw(ctx = this.ctx) {
    const { x, y } = this.position
    const { x: dx, y: dy } = this.direction
    ctx.beginPath()
    ctx.strokeStyle = 'blue'
    ctx.moveTo(x, y)
    ctx.lineTo(x + 1000 * dx, y + 1000 * dy)
    ctx.stroke()
  }

  cast(boundary) {
    const { position: pos, direction: dir } = this
    const {
      a: {
        x: x1,
        y: y1
      },
      b: {
        x: x2,
        y: y2
      }
    } = boundary
    const x3 = pos.x
    const y3 = pos.y
    const x4 = x3 + dir.x
    const y4 = y3 + dir.y

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    if (denominator === 0) {
      return null
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

    if (u >= 0 && t >= 0 && t <= 1) {
      const point = new Vec2(x1 + t * (x2 - x1), y1 + t * (y2 - y1))
      return point
    } else {
      return null
    }
  }
}

export default Ray
