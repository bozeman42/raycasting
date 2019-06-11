import { Vec2 } from "./math";
import Boundary from "./Boundary";

class Box {
  constructor(position, width, height) {
    this.position = position
    this.width = width
    this.height = height
    this.sides = []
    this.buildSides()
  }

  buildSides() {
    const {
      position: { x, y },
      width,
      height
    } = this
    this.sides.push(
      new Boundary( x, y, x + width, y),
      new Boundary( x, y, x, y + height),
      new Boundary( x + width, y, x + width, y + height),
      new Boundary( x, y + height, x + width, y + height)
    )
  }

  draw() {
    this.sides.forEach(side => side.draw())
  }

}

export default Box;
