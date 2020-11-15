import Canvas from '@/classes/canvas'
import Stroke from '@/classes/stroke'
import Color from '@/classes/color'
import Point from '@/classes/point'
import Layer from '@/classes/layer'

import util from '@/utils'

class Animation extends Canvas {
  layerIndex: number
  strokeIndex: number

  constructor(args:any) {
    super(args)

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

  render() {
    const {
      points: [ start, end ],
      color,
      width
    } = this.layers[this.layerIndex].strokes[this.strokeIndex]

    const r = 12
    let a = util.between(0, 2 * Math.PI)
    a = Math.round(a * Math.PI) / (Math.PI)

    const point = new Point({
      x: end.x + r * Math.cos(a),
      y: end.y + r * Math.sin(a)
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
    this.strokeIndex += 1
    this.redraw()

    if (point.y > this.margin && point.x > this.margin && point.y < this.height - this.margin && point.x < this.width - this.margin) {
      this.animate = util.requestInterval(10, () => this.render())
    } else {
      this.animate.cancel()
      stroke.points = [
        new Point(this.center),
        new Point(this.center)
      ]
      this.layers.push(new Layer({ strokes: [ stroke ] }))
      this.layerIndex += 1
      this.strokeIndex = 0
      this.render()
    }
  }
}

export default Animation
