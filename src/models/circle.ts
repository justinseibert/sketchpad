import Point from 'src/models/point'

class Circle {
    center: Point
    radius: number
    threshold: number
    distance: number

    constructor(x: number, y: number, radius: number) {
        this.center = new Point(x,y)
        this.radius = radius
        this.threshold = 0
        this.distance = 0
    }

    public get boundary() {
        return this.radius + this.threshold
    }

    public intersectionsWith(other: Circle) {
        if (!this.doesIntersectWith(other)) {
            return []
        }

        const dx = (other.center.x - this.center.x) / this.distance
        const dy = (other.center.y - this.center.y) / this.distance

        const x = (this.boundary**2 - other.boundary**2 + this.distance**2) / (2 * this.distance)
        const y = Math.sqrt(this.boundary**2 - x**2)

        const p1 = new Point(
            this.center.x + x * dx - y * dy,
            this.center.y + x * dy + y * dx
        )

        if (this.distance === this.boundary + other.boundary) {
            return [ p1 ]
        }

        const p2 = new Point(
            this.center.x + x * dx + y * dy,
            this.center.y + x * dy - y * dx
        )

        return [
            p1,
            p2,
        ]
    }

    public doesIntersectWith(other: Circle) {
        this.distance = this.center.distanceFrom(other.center)
        
        if (this.distance > this.boundary + other.boundary || this.distance < Math.abs(this.boundary - other.boundary)) {
            return false
        }
        
        return true
    }
}

export default Circle