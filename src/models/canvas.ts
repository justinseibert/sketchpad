import Point from 'src/models/point'

import { CanvasOptions } from 'src/types/canvas'

class Canvas {
  ctx: CanvasRenderingContext2D
  dpi: number
  container: HTMLDivElement
  el: HTMLCanvasElement
  center: Point
  height: number
  width: number
  zIndex: number

  constructor(container: HTMLDivElement, options: CanvasOptions) {
    this.container = container

    this.height = options.height || window.innerHeight
    this.width = options.width || window.innerWidth
    this.center = new Point(
      this.width / 2,
      this.height / 2,
    )

    this.dpi = options.dpi || 2
    this.zIndex = options.zIndex || 1

    
    this.el = document.createElement('canvas')
    this.ctx = this.el.getContext('2d')
    
    this.el.width = this.width * this.dpi
    this.el.height = this.height * this.dpi
    this.el.style.width = this.container.style.width = `${this.width}px`
    this.el.style.height = this.container.style.height = `${this.height}px`
    this.el.style.position = 'absolute'
    this.el.style.top = '0px'
    this.el.style.left = '0px'
    this.el.style.zIndex = `${this.zIndex}px`

    this.container.appendChild(this.el)

    this.ctx.scale(this.dpi, this.dpi)
    this.ctx.save()
  }
}

export default Canvas
