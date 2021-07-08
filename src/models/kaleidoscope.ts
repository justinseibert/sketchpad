import Canvas from 'src/models/canvas'
import Arc from 'src/models/arc'
import Point from 'src/models/point'
import Line from 'src/models/line'

import { radian, rotatePoint } from 'src/utils/geometry'

class Kaleidoscope {
  canvas: Canvas
  hash: string
  height: number
  pixels: number[]
  scale: number
  sliceAngle: number
  slices: number
  width: number

  constructor(canvas: Canvas) {
    this.canvas = canvas
    this.hash = '7afa54412789e11a7ade54bc3b3d72acdd263995d4330c36249df3e5bcef0a71' //sha256
    this.width = 200
    this.height = this.width
    this.scale = this.width * .01
    this.pixels = []
    this.slices = 12
  }

  public get slicedAngle() : number {
    return radian(360 / this.slices)
  }

  render() {
    // this.markBounds()
    this.canvas.ctx.save()
    this.generatePattern()
    this.draw()
    this.canvas.ctx.restore()
  }

  markBounds() {
    const { ctx, center: { x, y } } = this.canvas
    const dash = 5

    ctx.strokeStyle = '#f00'
    // crosshair x
    ctx.beginPath()
    ctx.moveTo(
      x - dash,
      y,
    )
    ctx.lineTo(
      x + dash,
      y,
    )
    ctx.stroke()

    // crosshair y
    ctx.beginPath()
    ctx.moveTo(
      x,
      y - dash,
    )
    ctx.lineTo(
      x,
      y + dash,
    )
    ctx.stroke()

    // pattern
    ctx.beginPath()
    ctx.moveTo(
      x,
      y
    )
    ctx.lineTo(
      x + this.width / 2,
      y
    )
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(
      x,
      y
    )
    ctx.lineTo(
      x + this.width / 2,
      y + this.height / 2,
    )
    ctx.stroke()

    // boundary
    ctx.beginPath()
    ctx.rect(
      x - this.width / 2,
      y - this.height / 2,
      this.width,
      this.height,
    )
    ctx.stroke()
  }

  generatePattern() {
    const { ctx, center } = this.canvas

    const safeIndex = (i:number) => {
      return i % this.hash.length
    }

    for (let index = 0; index < this.hash.length; index += 2) {
      // origin of new arc based on +3 indexed nyble
      const offset = this.getScale(this.hash[safeIndex(index + 2)])

      // change the reflection pattern every 6 nyble, based on +4 indexed nyble
      if (index % 4 === 0) {
        this.slices = this.dec(this.hash[safeIndex(index + 4)]) * 2 + 4
      }

      const arcCenter = new Point(
        center.x + offset,
        center.y
      )
      // radius of new arc based on +0 indexed byte
      const radius = this.getScale(this.hash.substring(index, index+2))

      const arc = new Arc(
        arcCenter,
        radius
      )

      const increment = radian(this.scale)
      const total = radian(180)
      const maxWidth = center.x + this.width / 2
      let a = 0

      while (a < total) {
        const point = arc.stroke(a)
        const test = new Line(center, point)
        const originAngle = test.angle
        a += increment
        if (point.x > maxWidth || originAngle > this.slicedAngle) {
          continue
        }
        this.addPixel(point)
        this.generateReflections(point, originAngle)
      }
    }
  }

  generateReflections(point: Point, angle: number) {
    const { center } = this.canvas
    for (let slice = 1; slice < this.slices; slice++) {
      let rotation = ((this.slicedAngle * slice) - angle) * 2
      const reflection = rotatePoint(center, point, rotation)
      this.addPixel(reflection)
      point = reflection
      angle += rotation
    }
  }

  getPixel({ x, y }: Point) {
    return (x << 16) | y
  }

  getPoint(pixel: number) {
    return new Point(
      (pixel >> 16),
      (pixel & 0xffff)
    )
  }

  addPixel(point: Point) {
    this.pixels.push(this.getPixel(point))
  }

  draw() {
    const { ctx } = this.canvas

    ctx.fillStyle = '#ddd'
    this.pixels.forEach((pixel) => {
      const { x, y } = this.getPoint(pixel)
      ctx.beginPath()
      ctx.fillRect(x, y, 1, 1)
    })
  }

  evenOdd(n:number) {
    return Math.floor(n/2) === n/2 ? 1 : -1
  }

  getScale(hex:string) {
    const ratio = this.dec(hex) / this.dec('f'.repeat(hex.length))
    return (this.width / 2) * ratio
  }

  dec(hex:string) {
    return Number.parseInt(hex, 16)
  }
}

export default Kaleidoscope
