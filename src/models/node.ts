import { random, orderBy } from 'lodash'

import Point from 'src/models/point'
import Sun from 'src/models/sun'

import { radian, radianBetween } from 'src/utils/geometry'
import { chance } from 'src/utils/math'

class Node {
    parent: Node | null
    children: Node[]
    origin: Point
    angle: number
    weight: number

    constructor(origin: Point, parent: Node | null = null) {
        this.parent = parent
        this.origin = origin
        this.children = []
        this.weight = 1
        if (parent) {
            this.angle = radianBetween(parent.origin, origin)
        } else {
            this.angle = 0
        }
    }

    private _randomTurn(maximumDegree: number) {
        const angle = radian(random(0, maximumDegree))
        const direction = chance().num

        return angle * direction
    }

    public addChild(sun: Sun) {
        const jitter = this._randomTurn(40)
        const angle = radianBetween(this.origin, sun.position) + jitter
        const radius = random(10,20)

        const point = new Point(
            this.origin.x + (radius * Math.cos(angle)),
            this.origin.y + (radius * Math.sin(angle))
        )

        const distance = point.distanceFrom(sun.position)
        if (distance < radius + sun.radius) {
            return null
        }

        const child = new Node(point, this)
        this.children.push(child)
        return child
    }

    public addWeight() {
        this.weight += 1
        this.parent.children = orderBy(this.parent.children, 'weight', 'desc')
    }
}

export default Node