import Canvas from '@/classes/canvas'

import util from '@/utils'

class Animation extends Canvas {
  render(x?: number, y?: number) {
    const { center, box, margin } = this.canvas

    x = x === undefined ? center.x : x
    y = y === undefined ? center.y : y

    this.ctx.strokeStyle = '#9e8c80'
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)

    const r = 12 //util.between(10,30)
    let a = util.between(0, 2 * Math.PI)
    a = Math.round(a * Math.PI) / (Math.PI)

    x += r * Math.cos(a)
    y += r * Math.sin(a)

    this.ctx.lineTo(x, y)
    this.ctx.stroke()

    if (y > margin && x > margin && y < box.h - margin && x < box.w - margin) {
      this.animate = util.requestInterval(10, () => this.render(x, y))
    } else {
      this.animate.cancel()
      this.render()
    }
  }
}

export default Animation
