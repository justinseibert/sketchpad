import Canvas from '@/classes/canvas'
import Stroke from '@/classes/stroke'
import Color from '@/classes/color'
import Point from '@/classes/point'
import Layer from '@/classes/layer'

import { between, chance } from '@/utils/math'
import { radian, distance } from '@/utils/geometry'

class Animation extends Canvas {
  direction: number
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
    return radian(between(-180, 180))
  }

  turn() {
    const { points: [ _, end ] } = this.layers[this.layerIndex].strokes[this.strokeIndex]

    const distanceFromEdge:any = {
      x: distance(this.center.x - this.margin, distance(this.center.x, end.x)),
      y: distance(this.center.y - this.margin, distance(this.center.y, end.y)),
    }

    const ratio = (axis:'x'|'y') => {
      return 1 - (distanceFromEdge[axis] / (this.center[axis] - this.margin))
    }

    const axis = distanceFromEdge.x < distanceFromEdge.y ? 'x' : 'y'
    const nearest = ratio(axis)
    const angle = radian(between(0, nearest * this.maxTurn))

    if (nearest > 0.9 && chance(0.1).bool) {
      this.direction *= -1
    }
    return angle * this.direction
  }

  handleDecay() {
    const updatedLayers = this.layers.reduce((layers:Layer[], layer:Layer) => {
      const updatedStrokes = layer.strokes.reduce((strokes:Stroke[], stroke:Stroke, index: number) => {
        stroke.color.l *= 0.999
        stroke.width *= 0.99

        if (stroke.color.l > this.color.l && stroke.width > 0.005) {
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
      this.animate = this.interval(30, () => this.render())
    } else {
      this.animate.cancel()
      const translation = { ...point }
      if (point.x < this.margin) {
        translation.x = this.width - this.margin
      } else if (point.y < this.margin) {
        translation.y = this.height - this.margin
      } else if (point.x > this.width - this.margin) {
        translation.x = this.margin
      } else if (point.y > this.height - this.margin) {
        translation.y = this.margin
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
