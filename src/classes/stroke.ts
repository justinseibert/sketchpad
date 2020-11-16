import Color from './color'
import Point from './point'

import { radianBetween, direction } from '@/utils/geometry'

type TCap = 'butt' | 'round' | 'square'

interface IStroke {
  color: Color
  points: Point[]
  width: number
  cap: TCap
}

class Stroke {
  color: Color
  points: Point[]
  width: number
  cap: TCap

  constructor(args:Partial<IStroke>) {
    this.color = args.color || new Color({})
    this.points = args.points || [ new Point({}), new Point({}) ]
    this.width = args.width || 1
    this.cap = args.cap || 'round'
  }

  get vector() {
    const [ a, b ] = this.points
    return {
      a: radianBetween(a, b),
      x: direction(a.x, b.x),
      y: direction(b.y, a.y),
    }
  }
}

export default Stroke
