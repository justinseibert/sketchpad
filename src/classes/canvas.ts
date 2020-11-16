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
    this.margin = -3
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
        this.ctx.lineCap = stroke.cap
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

  interval(interval:number, callback: () => void) {
    let start = Date.now(),
        cancel = false

    const onInterval = () => {
      cancel || Date.now() - start > interval ? callback() : window.requestAnimationFrame(onInterval)
    }

    window.requestAnimationFrame(onInterval)

    return {
      cancel: () => cancel = true
    }
  }
}

export default Canvas
