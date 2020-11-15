import Color from './color'
import Point from './point'

import u from '@/utils'

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
      a: u.radianBetween(a, b),
      x: u.direction(a.x, b.x),
      y: u.direction(a.y, b.y),
    }
  }
}

export default Stroke
