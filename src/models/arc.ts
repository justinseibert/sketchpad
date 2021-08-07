import Point from 'src/models/point'

class Arc {
    center: Point
    start: Point
    end: Point
    radius: number

    constructor(center: Point, start: Point, end: Point, radius?: number) {
        this.center = center
        this.start = start
        this.end = end

        this.radius = radius || center.distanceFrom(start)
    }

    public get startAngle(): number {
        return this.center.radianTo(this.start)
    }

    public get endAngle(): number {
        return this.center.radianTo(this.end)
    }

    public get canvasArgs(): [number, number, number, number, number, boolean] {
        return [
            this.center.x,
            this.center.y,
            this.radius,
            this.startAngle,
            this.endAngle,
            false,
        ]
    }
}

export default Arc