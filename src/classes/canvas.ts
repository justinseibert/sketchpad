import { IntervalType, CanvasType, PointType } from '@/types'

import Color from '@/classes/color'
import Layer from '@/classes/layer'
import Point from '@/classes/point'
import Stroke from '@/classes/stroke'

class Canvas {
  animate: IntervalType
  ctx: CanvasRenderingContext2D
  dpi: number
  el: HTMLCanvasElement
  margin: number
  layers: Layer[]
  center: Point
  color: Color
  height: number
  width: number

  constructor(el: HTMLCanvasElement) {
    this.center = new Point({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    this.color = new Color({
      h: 30,
      s: 7,
      l: 17
    })
    this.el = el
    this.ctx = el.getContext('2d')
    this.dpi = 2
    this.height = window.innerHeight
    this.layers = [] as Layer[]
    this.margin = 0
    this.width = window.innerWidth
  }

  init() {
    this.el.width = this.width * this.dpi
    this.el.height = this.height * this.dpi
    this.el.style.width = `${this.width}px`
    this.el.style.height = `${this.height}px`

    this.ctx.scale(this.dpi,this.dpi)
    this.ctx.save()
  }

  redraw() {
    this.ctx.clearRect(0, 0, this.width, this.height)

    this.layers.forEach((layer:Layer) => {
      layer.strokes.forEach((stroke:Stroke) => {
        this.ctx.lineWidth = stroke.width
        this.ctx.strokeStyle = stroke.color.toString()
        this.ctx.beginPath()

        const points = [ ...stroke.points ]
        const start = points.shift()
        this.ctx.moveTo(start.x, start.y)
        points.forEach((point:Point) => {
          this.ctx.lineTo(point.x, point.y)
        })
        this.ctx.stroke()
      })
    })
  }
  // redraw() {
  //   this.ctx.clearRect(0, 0, this.width, this.height)
  //
  //   this.layers.forEach((layer:Layer) => {
  //     layer.strokes.forEach((stroke:Stroke))
  //     item.color.l -= 3
  //     if (item.color.l <= background.l) {
  //       return result
  //     }
  //
  //     this.ctx.lineWidth = item.color.l / 100
  //     this.ctx.strokeStyle = `hsl(${background.h}, ${background.s}%, ${item.color.l}%)`
  //     this.ctx.beginPath()
  //     this.ctx.moveTo(item.points[0].x, item.points[0].y)
  //
  //     const points = [ ...item.points ]
  //     points.shift()
  //     points.forEach(({ x, y }:PointType) => {
  //       this.ctx.lineTo(x,y)
  //     })
  //     this.ctx.stroke()
  //
  //     return [
  //       ...result,
  //       item
  //     ]
  //   }, [])
  //
  //   this.strokes = strokes
  //   console.log(this.strokes)
  // }
}

export default Canvas
