import Color from './color'
import Point from './point'

interface IStroke {
  color: Color
  points: Point[]
  width: number
}

class Stroke {
  color: Color
  points: Point[]
  width: number

  constructor(args:Partial<IStroke>) {
    this.color = args.color || new Color({})
    this.points = args.points || [ new Point({}), new Point({}) ]
    this.width = args.width || 1
  }
}

export default Stroke
