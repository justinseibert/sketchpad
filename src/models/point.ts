class Point {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  public distanceFrom(point: Point) {
    const dx = Math.abs(point.x - this.x);
    const dy = Math.abs(point.y - this.y);
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  public radianTo(point: Point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
  }

  public midPointFrom(point: Point) {
    return new Point((this.x + point.x) / 2, (this.y + point.y) / 2);
  }
}

export default Point;
