import Point from 'src/models/point'
import Arc from './arc'

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

    public intersectionsWith(other: Circle, threshold: number = 0) {
        if (!this.doesIntersectWith(other, threshold)) {
            return []
        }

        const dx = (other.center.x - this.center.x) / this.distance
        const dy = (other.center.y - this.center.y) / this.distance

        const x = (this.boundary**2 - other.boundary**2 + this.distance**2) / (2 * this.distance)
        const y = Math.sqrt(this.boundary**2 - x**2)

        const clock = new Point(
            this.center.x + x * dx - y * dy,
            this.center.y + x * dy + y * dx
        )

        if (this.distance === this.boundary + other.boundary) {
            return [ clock ]
        }

        const anticlock = new Point(
            this.center.x + x * dx + y * dy,
            this.center.y + x * dy - y * dx
        )

        return [
            clock,
            anticlock,
        ]
    }

    public doesIntersectWith(other: Circle, threshold: number = 0) {
        this.threshold = threshold
        other.threshold = threshold

        this.distance = this.center.distanceFrom(other.center)
        
        if (this.distance >= this.boundary + other.boundary || this.distance <= Math.abs(this.boundary - other.boundary)) {
            return false
        }
        
        return true
    }

    public getMetaball(other: Circle, threshold: number = 0) {
        // order points by clock -> anticlock -> clock -> anticlock
        const touchCenters = this.intersectionsWith(other, threshold)
        if (touchCenters.length < 2) {
            // not touching, not connected
            return {
                preemptivePhase: true,
                arcs: []
            }
        }

        const radius = threshold + 0.001
        const touchCircles = touchCenters.map((point: Point) => {
            return new Circle(point.x, point.y, radius)
        })

        
        // connected phase
        const mergePoints = touchCircles.map((circle: Circle, index: number) => {
            const otherPoint = circle.intersectionsWith(other)[0]
            const thisPoint = circle.intersectionsWith(this)[0]
            
            if (index === 0) {
                return {
                    start: otherPoint,
                    end: thisPoint,
                }
            } else {
                return {
                    start: thisPoint,
                    end: otherPoint,
                }
            }
        })

        const preemptivePhase = touchCircles[0].doesIntersectWith(touchCircles[1]) && this.distance > this.boundary
        if (preemptivePhase) {
            // preemptive phase (touching boundaries, but not connected)
            const touchPoints = touchCircles[0].intersectionsWith(touchCircles[1])
            return {
                preemptivePhase,
                arcs: [
                    new Arc(
                        touchCenters[0],
                        mergePoints[0].start,
                        touchPoints[0],
                        radius,
                    ),
                    new Arc(
                        other.center,
                        mergePoints[1].end,
                        mergePoints[0].start,
                        other.radius,
                    ),
                    new Arc(
                        touchCenters[1],
                        touchPoints[0],
                        mergePoints[1].end,
                        radius,
                    ),
                    new Arc(
                        touchCenters[1],
                        touchPoints[1],
                        mergePoints[1].start,
                        radius,
                    ),
                    new Arc(
                        this.center,
                        mergePoints[1].start,
                        mergePoints[0].end,
                        this.radius,
                    ),
                    new Arc(
                        touchCenters[0],
                        mergePoints[0].end,
                        touchPoints[1],
                        radius,
                    ),
                ]
            }
        }

        return {
            preemptivePhase,
            arcs: [
                new Arc(
                    touchCenters[0],
                    mergePoints[0].start,
                    mergePoints[0].end,
                    radius,
                ),
                new Arc(
                    this.center,
                    mergePoints[0].end,
                    mergePoints[1].start,
                    this.radius,
                ),
                new Arc(
                    touchCenters[1],
                    mergePoints[1].start,
                    mergePoints[1].end,
                    radius,
                ),
                new Arc(
                    other.center,
                    mergePoints[1].end,
                    mergePoints[0].start,
                    other.radius,
                )
            ]
        } 


    }
}

export default Circle