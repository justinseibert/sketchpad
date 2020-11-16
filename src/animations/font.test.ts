import Canvas from '@/classes/canvas'
import Stroke from '@/classes/stroke'
import Color from '@/classes/color'
import Point from '@/classes/point'
import Layer from '@/classes/layer'

import { IHeading } from '@/types'

import { radian } from '@/utils/geometry'
import { between } from '@/utils/math'
import { letters } from '@/utils/font'

class Animation extends Canvas {
  layerIndex: number
  strokeIndex: number

  constructor(args:any) {
    super(args)

    this.layerIndex = 0
    this.strokeIndex = 0

    this.layers = [
      new Layer({ strokes: [] })
    ]

    this.registerListeners()
  }

  registerListeners = () => {
    document.addEventListener('keyup', this.renderKey)
  }

  alternateColor = (color:Color, index:number) => {
    color.l = index/2 === Math.round(index/2) ? 50 : 100
    return color
  }

  fadeColor = (color:Color, index:number, max:number) => {
    color.l = 100 - (index/max) * 100
    return color
  }

  renderKey = (e:KeyboardEvent) => {
    const character = letters[e.key.toLowerCase()]
    if (!character) {
      return
    }
    const strokes:Stroke[] = []
    let color:Color = {
      h: 30,
      s: 7,
      l: 100,
      a: 1,
    }
    let start = { ...this.center }
    let angle = radian(90)
    character.forEach((heading:IHeading, index: number) => {
      const segment = between(20,25) * heading.duration
      // const segment = 20 * heading.duration
      color.l = 100
      for (let i = 0; i < segment; i++) {
        const r = 3
        angle += radian(between(heading.turn * 0.95, heading.turn) / segment)
        // angle += radian(heading.turn / segment)
        const end = new Point({
          x: start.x + (r * Math.sin(angle)),
          y: start.y + (r * Math.cos(angle))
        })
        const points = [
          new Point(start),
          new Point(end)
        ]

        color = this.fadeColor(color, i, segment)
        if (heading.off) {
          color.l = this.color.l + 10
        }

        const stroke = new Stroke({
          color: new Color(color),
          points,
          width: 2
        })
        strokes.push(stroke)
        start = end
      }
    })

    this.layers = [ new Layer({ strokes })]
    this.redraw()
  }

  render() {}
}

export default Animation
