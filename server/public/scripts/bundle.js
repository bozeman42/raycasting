(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  class Layer {
    constructor(width, height, color, bgColor) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.scale(2,2);
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx.strokeStyle = color;
      this.bgColor = bgColor;
    }

    

    clear(x = 0, y = 0, w = this.canvas.width, h = this.canvas.height) {
      this.ctx.fillStyle = this.fillStyle;
      this.ctx.fillRect(x,y,w,h);
    }

  }

  const { cos, sin, PI } = Math;

  class Vec2 {
    constructor(x = 0, y = 0) {
      this._x = x;
      this._y = y;
    }

    setByAngLen(angle = 0, length = 1) {
      this._x = length * cos(angle / 360 * 2 * PI);
      this._y = length * sin(angle / 360 * 2 * PI);
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
      const { _x, _y } = this;
      const { PI, cos, sin } = Math;
      const rad = angle * ( PI / 180 );
      this.setVec(_x * cos(rad) - _y * sin(rad), _x * sin(rad) + _y * cos(rad));
      return this
    }

    setVec (x, y) {
      this._x = x,
      this._y = y;
      return this
    }

    get coords () {
      return [ this.x, this.y ]
    }

    get magnitude() {
      const { x, y } = this;
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y,2))
    }

    set magnitude(length) {
      this.setVec(length * (this._x / this.magnitude), length * (this._y / this.magnitude));
    }

    direction (length = 1) {
      return [
        length * (this._x / this.magnitude),
        length * (this._y / this.magnitude)
      ]
    }

    normalize () {
      this.magnitude = 1;
      return this
    }

    difference(vec) {
      return new Vec2(this.x - vec.x, this.y - vec.y)
    }

    distance(vec) {
      return this.difference(vec).magnitude
    }

    translate(x,y) {
      this._x += x;
      this._y += y;
      return this
    }
  }

  class Ray {
    constructor(xPos, yPos, angle = 0, ctx) {
      this.ctx = ctx;
      this.angle = angle;
      this.position = new Vec2(xPos,yPos),
      this.direction = new Vec2().setByAngLen(this.angle);
    }

    setPosition(x,y) {
      this.position.setVec(x,y);
    }

    draw(ctx = this.ctx) {
      const { x, y } = this.position;
      const { x: dx, y: dy } = this.direction;
      ctx.beginPath();
      ctx.strokeStyle = 'blue';
      ctx.moveTo(x, y);
      ctx.lineTo(x + 1000 * dx, y + 1000 * dy);
      ctx.stroke();
    }

    cast(boundary) {
      const { position: pos, direction: dir } = this;
      const {
        a: {
          x: x1,
          y: y1
        },
        b: {
          x: x2,
          y: y2
        }
      } = boundary;
      const x3 = pos.x;
      const y3 = pos.y;
      const x4 = x3 + dir.x;
      const y4 = y3 + dir.y;

      const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

      if (denominator === 0) {
        return null
      }

      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
      const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

      if (u >= 0 && t >= 0 && t <= 1) {
        const point = new Vec2(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
        return point
      } else {
        return null
      }
    }
  }

  class RaySource {
    constructor(x,y, ctx) {
      this.ctx = ctx;
      this.pos = new Vec2(x,y);
      this.rays = [];
      const {posX,posY} = this.pos;
      for (let i = 0; i < 360; i += .1) {
        this.rays.push(new Ray(posX, posY, i));
      }
      this.points = [];
    }

    setPosition(x,y) {
      this.pos.setVec(x,y);
      this.rays.forEach(ray => {
        ray.setPosition(x,y);
      });
    }

    cast(boundaries) {
      this.points = [];
      this.rays.forEach(ray => {
        let shortestDistance = Infinity;
        let closestPoint = null;
        boundaries.forEach(boundary => {
          const point = ray.cast(boundary);
          if (point) {
            let distance = point.distance(this.pos);
            if (distance < shortestDistance) {
              closestPoint = point;
              shortestDistance = distance;
            }
          }
        });
        if (closestPoint) {
          this.points = [
            ...this.points,
            closestPoint
          ];
        }
      });
    }

    draw() {
      const { ctx, pos} = this;
      // this.rays.forEach(ray => ray.draw(ctx))
      this.points.forEach((point) => {
        const { x, y } = point;
        ctx.beginPath();
        const value = pos.distance(point);
        const distance = value > 10 ? value : 10;
        const intensity = mapIntensity(distance);
        ctx.strokeStyle = `RGB(${intensity},${intensity},0)`;
        ctx.rect(x,y,1,1);
        ctx.stroke();
      });
    }
  }

  function mapIntensity(distance) {
    return 255 / Math.pow(distance / 150, 2)
  }

  class Boundary {
    constructor(x1,y1,x2,y2) {
      this.a = new Vec2(x1,y1);
      this.b = new Vec2(x2,y2);
    }

    draw(ctx) {
      const { a, b } = this;
      ctx.beginPath();
      const style = ctx.strokeStyle;
      ctx.strokeStyle = '#222';
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.strokeStyle = style;
    }
  }

  const INTERVAL = 0.1;

  class Circle {
    constructor(x,y,radius) {
      this.pos = new Vec2(x,y);
      this.radius = radius;
      this.noBreaks = true;
      this.boundaries = [];
      this.buildCircle();
    }

    draw(ctx) {
      this.boundaries.forEach(boundary => boundary.draw(ctx));
    }

    buildCircle() {
      const { sin, cos, PI } = Math;
      const { pos: { x: xPos, y: yPos }, radius: r, noBreaks } = this;
      let x = xPos + r*sin(0);
      let y = yPos + r*cos(0);
      let x2, y2;
      for (let theta = INTERVAL; theta <= PI * 2; theta += INTERVAL) {
        x2 = xPos + r*sin(theta);
        y2 = yPos + r*cos(theta);
        if (Math.round(theta / INTERVAL) % 2 || noBreaks) {
          this.boundaries.push(new Boundary(x,y,x2,y2));
        }
        x = x2;
        y = y2;
      }
      x2 = xPos + r*sin(0);
      y2 = yPos + r*cos(0);
      this.boundaries.push(new Boundary(x,y,x2,y2));
    }
  }

  class Box {
    constructor(position, width, height) {
      this.position = position;
      this.width = width;
      this.height = height;
      this.sides = [];
      this.buildSides();
    }

    buildSides() {
      const {
        position: { x, y },
        width,
        height
      } = this;
      this.sides.push(
        new Boundary( x, y, x + width, y),
        new Boundary( x, y, x, y + height),
        new Boundary( x + width, y, x + width, y + height),
        new Boundary( x, y + height, x + width, y + height)
      );
    }

    draw() {
      this.sides.forEach(side => side.draw());
    }

  }

  const w = window.innerWidth;
  const h = window.innerHeight;

  const mainLayer = new Layer(w,h, 'yellow', 'black');

  document.body.appendChild(mainLayer.canvas);
  const boundaries = [...boxWalls(mainLayer)];

  for(let i = 0; i < 20; i++) {
    boundaries.push(...new Box(
      new Vec2(Math.random() * w, Math.random() * h)
      , (Math.random() * 200),(Math.random() * 200))
      .sides
      // ...buildCircle().boundaries
      );
  }

  // for (let i = 0; i < 3; i++) {
  //   boundaries.push(createWall())
  // }

  boundaries.push(...new Circle(Math.random() * w,Math.random() * h ,5).boundaries, ...new Circle(Math.random() * w, Math.random() * h, 100).boundaries);

  const source = new RaySource(100,200, mainLayer.ctx);
  let drawBoundaries = false;

  document.onclick = () => {
    drawBoundaries = !drawBoundaries;
    draw(mainLayer);
  };

  function draw (layer) {
    const { ctx } = layer;
    layer.clear();
    if (drawBoundaries) {
      boundaries.forEach(boundary => boundary.draw(ctx));
    }
    source.cast(boundaries);
    source.draw(ctx);
  }

  mainLayer.canvas.addEventListener('mousemove', e => {
    const { offsetX: dx, offsetY: dy } = e;
    source.setPosition(dx,dy);
    draw(mainLayer);
  });


  function boxWalls(layer) {
    const {
      canvas: {
        height,
        width
      }
    } = layer;
    return [
      new Boundary(0,0,0,height),
      new Boundary(0,0,width,0),
      new Boundary(0,height,width,height),
      new Boundary(width, 0, width, height)
    ]
  }

  draw(mainLayer);

}));
