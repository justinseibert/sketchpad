import Canvas from '@/classes/canvas'
import Stroke from '@/classes/stroke'
import u from '@/utils'

import { CanvasType, PointType } from '@/types'

class Animation extends Canvas {
  point: PointType
  angle: number
  maxTurn: number
  strokeIndex: number
  pointIndex: number

  constructor(canvas: CanvasType) {
    super(canvas)
    this.point = { ...canvas.center }
    this.angle = this.randomAngle()
    this.maxTurn = 10
    this.strokeIndex = 0
    this.pointIndex = 0

    const stroke:Stroke = new Stroke(this.canvas)
    stroke.setLightness()
    this.strokes = [ stroke ]
  }

  randomAngle() {
    return u.radian(u.between(-360, 360))
  }

  turn() {
    const { center, margin } = this.canvas
    const { x, y } = this.strokes[this.strokeIndex].points[this.pointIndex]

    const distanceFromEdge:any = {
      x: u.distance(center.x - margin, u.distance(center.x, x)),
      y: u.distance(center.y - margin, u.distance(center.y, y)),
    }

    const ratio = (axis:'x'|'y') => {
      return 1 - (distanceFromEdge[axis] / (center[axis] - margin))
    }

    const angle = ratio(distanceFromEdge.x < distanceFromEdge.y ? 'x' : 'y') * this.maxTurn

    return u.radian(u.between(angle - this.maxTurn, angle + this.maxTurn))
  }

  render() {
    const { box, margin } = this.canvas

    const current:Stroke = this.strokes[this.strokeIndex]
    const point = current.points[this.pointIndex]

    const r = 12
    const a = this.angle + this.turn()

    const x = point.x + (r * Math.sin(a))
    const y = point.y + (r * Math.cos(a))

    this.ctx.strokeStyle = current.getHSL()
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(point.x, point.y)
    this.ctx.lineTo(x,y)
    this.ctx.stroke()

    this.angle = a
    this.strokes[this.strokeIndex].points.push({ x, y })
    this.pointIndex += 1

    if (y > margin && x > margin && y < box.h - margin && x < box.w - margin) {
      this.animate = u.requestInterval(30, () => this.render())
    } else {
      this.animate.cancel()
      this.redraw()

      const stroke:Stroke = new Stroke(this.canvas)
      stroke.setLightness()

      this.strokes.push(stroke)
      this.strokeIndex += 1
      this.pointIndex = 0
      this.angle = this.randomAngle()
      this.render()
    }
  }
}

export default Animation
