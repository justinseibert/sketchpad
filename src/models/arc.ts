import Point from 'src/models/point'

class Arc {
  center: Point
  radius: number

  constructor(center: Point, radius: number) {
    this.center = center
    this.radius = radius
  }

  stroke(angle: number) {
    const x = this.center.x + this.radius * Math.cos(angle)
    const y = this.center.y + this.radius * Math.sin(angle)
    return new Point(x, y)
  }
}

export default Arc
