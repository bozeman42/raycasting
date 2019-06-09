class Layer {
  constructor(width, height, color, bgColor) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx.strokeStyle = color
    this.bgColor = bgColor
  }

  

  clear(x = 0, y = 0, w = this.canvas.width, h = this.canvas.height) {
    this.ctx.fillStyle = this.fillStyle
    this.ctx.fillRect(x,y,w,h)
  }

}

export default Layer