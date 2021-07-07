import Canvas from 'src/models/canvas'
import Arc from 'src/models/arc'
import Point from 'src/models/point'
import Line from 'src/models/line'

import { radian, rotatePoint } from 'src/utils/geometry'

class Kaleidoscope {
  canvas: Canvas
  hash: string
  width: number
  height: number
  pixels: number[]
  slices: number
  sliceAngle: number

  constructor(canvas: Canvas) {
    this.canvas = canvas
    // f6108089 fe232c96 4235dac2 10aab04e
    // f6 10 80 89  fe 23 2c 96 42 35 da c2 10 aa b0 4e
    // this.hash = '6a'
    // this.hash = 'f6108089fe232c964235dac210aab04e'
    // this.hash = '213ff08c960c9d2f7b405886a6e2a98a'
    this.hash = '5576bb5ec8d4bd6c6f6f178d828c2128' //justin seibert
    // this.hash = '1ba54aa653fb2448d00b7742adddb39a' //tara chowdhury
    // 15 6 1 0 8 0 | 15
    // 246 16 128   | 255
    // 3937 128     | 4095
    // this.chunks = []
    this.width = 256
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

    this.hash.split('').forEach((hex:string, index:number) => {
      // origin of new arc based on +2 indexed nyble
      const offset = this.getScale(this.hash[safeIndex(index + 2)])

      // change the reflection pattern every 8 nybles, based on +1 indexed nyble
      if (index % 8 === 0) {
        this.slices = (this.dec(this.hash[safeIndex(index + 1)]) * 2) + 4
        console.log(index, this.slices)
      }

      const arcCenter = new Point(
        center.x + offset,
        center.y
      )
      // radius of new arc based on +0 indexed nyble
      const radius = this.getScale(hex)

      const arc = new Arc(
        arcCenter,
        radius
      )

      const increment = radian(this.scale - this.scale/this.width)
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
    })
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
