import { Vec2 } from './math'

class Boundary {
  constructor(x1,y1,x2,y2) {
    this.a = new Vec2(x1,y1)
    this.b = new Vec2(x2,y2)
  }

  draw(ctx) {
    const { a, b } = this
    ctx.beginPath()
    const style = ctx.strokeStyle
    ctx.strokeStyle = 'gray'
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
    ctx.strokeStyle = style
  }
}

export default Boundary
