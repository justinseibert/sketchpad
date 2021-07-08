import Canvas from 'src/models/canvas'
import Arc from 'src/models/arc'
import Point from 'src/models/point'
import Line from 'src/models/line'

import { radian, rotatePoint } from 'src/utils/geometry'

import { IAttribute, IChunk } from './types'

class Kaleidoscope {
  attributes: IAttribute
  canvas: Canvas
  hash: string
  height: number
  pixels: number[]
  scale: number
  step: number
  width: number

  constructor(canvas: Canvas) {
    this.attributes = {
      offset: 0,
      radius: 0,
      slices: 0,
    } as IAttribute
    this.canvas = canvas
    this.hash = '7afa54412789e11a7ade54bc3b3d72acdd263995d4330c36249df3e5bcef0a71' //sha256
    this.pixels = []
    this.step = 4

    this.width = 256
    this.height = this.width
    this.scale = Math.sqrt(this.width * .03)
  }

  public render() {
    // this.markBounds()
    this.canvas.ctx.save()
    this.generatePattern()
    this.draw()
    this.canvas.ctx.restore()
  }

  private slicedBoundary() : number {
    return radian(360 / this.attributes.slices)
  }

  private getChunks(index:number): IChunk {
    const safe = (i:number) => {
      return i % this.hash.length
    }
    return {
      radius: this.hash.substring(index, index + this.step),
      offset: this.hash[safe(index + 1)],
      slice: this.hash[safe(index + 2)],
    }
  }

  private markBounds() {
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

  private generatePattern() {
    for (let index = 0; index < this.hash.length; index += this.step) {
      const chunk = this.getChunks(index)

      this.attributes.radius = this.getScale(chunk.radius)
      this.attributes.offset = this.getScale(chunk.offset)
      if (index % this.step === 0) {
        this.attributes.slices = (this.toDecimal(chunk.slice) * 2) + 4
      }

      const origin = new Point(this.canvas.center.x + this.attributes.offset, this.canvas.center.y)
      const arc = new Arc(origin, this.attributes.radius)

      const increment = radian(this.scale)
      const maximum = radian(180)
      const frameBoundary = this.canvas.center.x + this.width / 2
      let angle = 0

      while (angle < maximum) {
        const point = arc.stroke(angle)
        const testAngle = new Line(this.canvas.center, point).angle
        angle += increment
        if (point.x > frameBoundary || testAngle > this.slicedBoundary()) {
          continue
        }
        this.addPixel(point)
        this.generateReflections(point, testAngle)
      }
    }
  }

  private generateReflections(point: Point, angle: number) {
    for (let index = 1; index < this.attributes.slices; index++) {
      let rotation = ((this.slicedBoundary() * index) - angle) * 2
      const reflection = rotatePoint(this.canvas.center, point, rotation)
      this.addPixel(reflection)
      point = reflection
      angle += rotation
    }
  }

  private draw() {
    const { ctx } = this.canvas

    ctx.fillStyle = '#ddd'
    this.pixels.forEach((pixel) => {
      const { x, y } = this.getPoint(pixel)
      ctx.beginPath()
      ctx.fillRect(x, y, 1, 1)
    })
  }

  private getPixel({ x, y }: Point) {
    return (x << 16) | y
  }

  private getPoint(pixel: number) {
    return new Point(
      (pixel >> 16),
      (pixel & 0xffff)
    )
  }

  private addPixel(point: Point) {
    this.pixels.push(this.getPixel(point))
  }

  getScale(hex:string) {
    const ratio = this.toDecimal(hex) / this.toDecimal('f'.repeat(hex.length))
    return (this.width / 2) * ratio
  }

  toDecimal(hex:string) {
    return Number.parseInt(hex, 16)
  }
}

export default Kaleidoscope
