import Canvas from '@/classes/canvas'
import Stroke from '@/classes/stroke'
import Color from '@/classes/color'
import Point from '@/classes/point'
import Layer from '@/classes/layer'

import u from '@/utils'

class Animation extends Canvas {
  angle: number
  maxTurn: number
  layerIndex: number
  strokeIndex: number

  constructor(args:any) {
    super(args)

    this.angle = this.randomAngle()
    this.maxTurn = 10
    this.layerIndex = 0
    this.strokeIndex = 0

    const stroke:Stroke = new Stroke({
      color: new Color(this.color),
      points: [ new Point(this.center), new Point(this.center) ]
    })
    stroke.color.l = 100
    this.layers = [
      new Layer({ strokes: [ stroke ] })
    ]
  }

  randomAngle() {
    return u.radian(u.between(-360, 360))
  }

  turn() {
    const [ start, end ] = this.layers[this.layerIndex].strokes[this.strokeIndex].points

    const distanceFromEdge:any = {
      x: u.distance(this.center.x - this.margin, u.distance(this.center.x, end.x)),
      y: u.distance(this.center.y - this.margin, u.distance(this.center.y, end.y)),
    }

    const ratio = (axis:'x'|'y') => {
      return 1 - (distanceFromEdge[axis] / (this.center[axis] - this.margin))
    }

    const angle = ratio(distanceFromEdge.x < distanceFromEdge.y ? 'x' : 'y') * this.maxTurn

    return u.radian(u.between(angle - this.maxTurn, angle + this.maxTurn))
  }

  render() {
    const { strokes } = this.layers[this.layerIndex]
    const { points: [ start, end ], color, width } = strokes[this.strokeIndex]

    const r = 12
    const a = this.angle + this.turn()

    const point = new Point({
      x: end.x + (r * Math.sin(a)),
      y: end.y + (r * Math.cos(a))
    })

    const stroke = new Stroke({
      color: new Color(color),
      width,
      points: [
        new Point(end),
        point,
      ]
    })

    this.layers[this.layerIndex].strokes.push(stroke)
    this.angle = a
    this.strokeIndex += 1
    this.redraw()

    if (point.y > this.margin && point.x > this.margin && point.y < this.height - this.margin && point.x < this.width - this.margin) {
      this.animate = u.requestInterval(30, () => this.render())
    } else {
      this.animate.cancel()
      stroke.points = [
        new Point(this.center),
        new Point(this.center)
      ]
      this.layers.push(new Layer({ strokes: [ stroke ] }))
      this.layerIndex += 1
      this.strokeIndex = 0
      this.angle = this.randomAngle()
      this.render()
    }
  }
}

export default Animation
