import Canvas from '@/classes/canvas'
import Stroke from '@/classes/stroke'
import Color from '@/classes/color'
import Point from '@/classes/point'
import Layer from '@/classes/layer'

import u from '@/utils'

class Animation extends Canvas {
  direction: number
  angle: number
  maxTurn: number
  layerIndex: number
  strokeIndex: number

  constructor(args:any) {
    super(args)

    this.angle = this.randomAngle()
    this.maxTurn = 15
    this.layerIndex = 0
    this.strokeIndex = 0
    this.direction = 1

    const stroke:Stroke = new Stroke({
      color: new Color(this.color),
      points: [ new Point(this.center), new Point(this.center) ],
      width: 6,
    })
    stroke.color.l = 90
    this.layers = [
      new Layer({ strokes: [ stroke ] })
    ]
  }

  randomAngle() {
    return u.radian(u.between(-180, 180))
  }

  turn() {
    const { points: [ _, end ] } = this.layers[this.layerIndex].strokes[this.strokeIndex]

    const distanceFromEdge:any = {
      x: u.distance(this.center.x - this.margin, u.distance(this.center.x, end.x)),
      y: u.distance(this.center.y - this.margin, u.distance(this.center.y, end.y)),
    }

    const ratio = (axis:'x'|'y') => {
      return 1 - (distanceFromEdge[axis] / (this.center[axis] - this.margin))
    }

    const nearest = ratio(distanceFromEdge.x < distanceFromEdge.y ? 'x' : 'y')
    const angle = u.radian(u.between(0, nearest * this.maxTurn))

    if (nearest < 0.7 && u.chance(0.01).bool) {
      this.direction *= -1
    }
    return angle * this.direction
  }

  handleDecay() {
    const updatedLayers = this.layers.reduce((layers:Layer[], layer:Layer) => {
      // let start:Point|null = null
      const updatedStrokes = layer.strokes.reduce((strokes:Stroke[], stroke:Stroke, index: number) => {
        stroke.color.l *= 0.999
        stroke.width *= 0.99


        if (stroke.color.l > this.color.l && stroke.width > 0.005) {
          // const end = { ...stroke.points[1] }
          // end.x *= u.between(0.999, 0.99)
          // end.y *= u.between(0.999, 0.99)
          // stroke.points = [
          //   start || stroke.points[1],
          //   end
          // ]
          // start = end
          strokes.push(stroke)
        }
        return strokes
      }, [])
      if (updatedStrokes.length > 0) {
        layers.push(new Layer({ strokes: updatedStrokes }))
      }
      return layers
    }, [])

    this.layers = [ ...updatedLayers ]
  }

  render() {
    const {
      points: [ _, end ],
      color,
      width
    } = this.layers[this.layerIndex].strokes[this.strokeIndex]

    const r = 8
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

    this.handleDecay()
    this.layerIndex = this.layers.length - 1
    this.layers[this.layerIndex].strokes.push(stroke)
    this.strokeIndex = this.layers[this.layerIndex].strokes.length - 1
    this.angle = a
    this.redraw()

    if (point.y > this.margin && point.x > this.margin && point.y < this.height - this.margin && point.x < this.width - this.margin) {
      this.animate = u.requestInterval(30, () => this.render())
    } else {
      this.animate.cancel()
      const translation = { ...point }
      if (point.x < this.margin) {
        translation.x = this.width - this.margin
      } else if (point.y < this.margin) {
        translation.y = this.height - this.margin
      } else if (point.x > this.width - this.margin) {
        translation.x = this.margin + 1
      } else if (point.y > this.height - this.margin) {
        translation.y = this.margin + 1
      }
      stroke.points = [
        new Point(translation),
        new Point(translation)
      ]
      this.layers.push(new Layer({ strokes: [ stroke ] }))
      this.layerIndex += 1
      this.strokeIndex = 0
      this.render()
    }
  }
}

export default Animation
