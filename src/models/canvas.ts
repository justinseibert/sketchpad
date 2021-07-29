import Point from 'src/models/point'

import { CanvasOptions } from 'src/types/canvas'

class Canvas {
  ctx: CanvasRenderingContext2D
  dpi: number
  el: HTMLCanvasElement
  center: Point
  height: number
  width: number

  constructor(el: HTMLCanvasElement, options: CanvasOptions) {
    this.height = options.height || window.innerHeight
    this.width = options.width || window.innerWidth
    this.center = new Point(
      this.width / 2,
      this.height / 2,
    )

    this.el = el
    this.ctx = el.getContext('2d')
    this.dpi = options.dpi || 2

    this._init()
  }

  private _init() {
    this.el.width = this.width * this.dpi
    this.el.height = this.height * this.dpi
    this.el.style.width = `${this.width}px`
    this.el.style.height = `${this.height}px`

    this.ctx.scale(this.dpi,this.dpi)
    this.ctx.save()
  }

  public clear() {
    this.ctx.clearRect(0,0,this.width, this.height)
  }
}

export default Canvas
