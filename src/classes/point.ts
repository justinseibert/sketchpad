interface IPoint {
  x: number
  y: number
}

class Point {
  x: number
  y: number

  constructor(args: Partial<IPoint>) {
    this.x = args.x || 0
    this.y = args.y || 0
  }
}

export default Point
