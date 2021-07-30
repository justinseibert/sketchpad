import Point from "./point";

class Arc {
    center: Point
    start: Point
    end: Point
    radius: number
    startAngle: number
    endAngle: number

    constructor(center: Point, start: Point, end: Point, radius?: number) {
        this.center = center
        this.start = start
        this.end = end

        this.radius = radius || center.distanceFrom(start)
        this.startAngle = center.radianTo(start)
        this.endAngle = center.radianTo(end)
    }
}

export default Arc