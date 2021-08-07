const r360 = 2 * Math.PI

class Point {
  x: number
  y: number

  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  public isSimilarTo(point: Point, margin: number = 0.01) {
    return (
      this.x + margin >= point.x &&
      this.x - margin <= point.x &&
      this.y + margin >= point.y &&
      this.y - margin <= point.y
    )
  }

  public distanceFrom(point: Point) {
    const dx = Math.abs(point.x - this.x)
    const dy = Math.abs(point.y - this.y)
    return Math.sqrt(dx ** 2 + dy ** 2)
  }

  public deltaFrom(point: Point) {
    const dx = point.x - this.x
    const dy = point.y - this.y
    return new Point(dx,dy)
  }

  public slopeTo(point: Point) {
    return (point.y - this.y) / (point.x - this.x)
  }

  public radianTo(point: Point) {
    return Math.atan2(point.y - this.y, point.x - this.x)
  }

  // get angle between points with "this" point as the origin
  public radianBetween(from: Point, to: Point, isClockwise: boolean = true) {
    const radianOfFrom = Math.atan2(from.y - this.y, from.x - this.x)
    const radianOfTo = Math.atan2(to.y - this.y, to.x - this.x)

    let radian = radianOfTo - radianOfFrom
    if (radian < 0) {
      radian += r360
    }

    if (!isClockwise) {
      radian = r360 - radian
    }

    return radian
  }

  public degreeBetween(from: Point, to: Point, isClockwise: boolean = true) {
    const radian = this.radianBetween(from, to, isClockwise)
    return radian * (180 / Math.PI)
  }
}

export default Point
