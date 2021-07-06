import Point from 'src/models/point'

import { hypotenuse, radianBetween } from 'src/utils/geometry'

class Line {
  a: Point
  b: Point

  constructor(a: Point, b: Point) {
    this.a = a
    this.b = b
  }

  testCollision(point: Point, padding: number = 0.01) {
    const ap = hypotenuse(this.a, point)
    const bp = hypotenuse(this.b, point)
    const difference = Math.abs(this.distance - (ap + bp))
    return {
      isNear: difference < padding,
      difference,
    }
  }

  public get distance() : number {
    return hypotenuse(this.a, this.b)
  }

  public get angle() : number {
    return radianBetween(this.a, this.b)
  }
}

export default Line
