import Layer from './modules/Layer'
import RaySource from './modules/RaySource'
import Boundary from './modules/Boundary'
const w = window.innerWidth
const h = window.innerHeight

const mainLayer = new Layer(w,h, 'yellow', 'black')

document.body.appendChild(mainLayer.canvas)
const boundaries = [...boxWalls(mainLayer)]
for (let i = 0; i < 3; i++) {
  boundaries.push(createWall())
}
const source = new RaySource(100,200, mainLayer.ctx)

function draw (layer) {
  const { ctx } = layer
  layer.clear()
  boundaries.forEach(boundary => boundary.draw(ctx))
  source.cast(boundaries)
  source.draw(ctx)
}

mainLayer.canvas.addEventListener('mousemove', e => {
  const { offsetX: dx, offsetY: dy } = e
  source.setPosition(dx,dy)
  draw(mainLayer)
})

function random(max) {
  return Math.random() * max
}

function createWall() {
  return new Boundary(random(mainLayer.canvas.width),random(mainLayer.canvas.height),random(mainLayer.canvas.width),random(mainLayer.canvas.height))
}

function boxWalls(layer) {
  const {
    canvas: {
      height,
      width
    }
  } = layer
  return [
    new Boundary(0,0,0,height),
    new Boundary(0,0,width,0),
    new Boundary(0,height,width,height),
    new Boundary(width, 0, width, height)
  ]
}