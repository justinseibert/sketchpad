import Color from 'src/models/color'
import Point from 'src/models/point'

class Canvas {
  ctx: CanvasRenderingContext2D
  dpi: number
  el: HTMLCanvasElement
  margin: number
  center: Point
  color: Color
  height: number
  width: number

  constructor(el: HTMLCanvasElement) {
    this.center = new Point(
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    this.color = new Color({
      h: 30,
      s: 7,
      l: 17
    })
    this.el = el
    this.ctx = el.getContext('2d')
    this.dpi = 2
    this.height = window.innerHeight
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
}

export default Canvas
