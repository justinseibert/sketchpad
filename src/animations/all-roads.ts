import Canvas from '@/classes/canvas'
import u from '@/utils'

import { CanvasType, PointType } from '@/types'

class Animation extends Canvas {
  point: PointType
  angle: number
  constructor(canvas: CanvasType) {
    super(canvas)
    this.point = { ...canvas.center }
    this.angle = this.turn(360)
  }

  turn(max: number) {
    const a = max / 2
    return u.radian(u.between(-a, a))
  }

  render() {
    const { center, box, margin } = this.canvas
    const r = 12
    const a = this.angle + this.turn(60)

    const x = this.point.x + (r * Math.sin(a))
    const y = this.point.y + (r * Math.cos(a))

    this.ctx.strokeStyle = '#9e8c80'
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(this.point.x, this.point.y)
    this.ctx.lineTo(x,y)
    this.ctx.stroke()

    this.angle = a
    this.point = { x, y }

    if (y > margin && x > margin && y < box.h - margin && x < box.w - margin) {
      this.animate = u.requestInterval(30, () => this.render())
    } else {
      this.animate.cancel()
      this.angle = this.turn(360)
      this.point = { ...center }
      this.render()
    }
  }
}

export default Animation
