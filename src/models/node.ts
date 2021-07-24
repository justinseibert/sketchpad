import Point from 'src/models/point'

import { radian, radianBetween } from 'src/utils/geometry'
import { between, chance } from 'src/utils/math'

class Node {
    parent: Node | null
    children: Node[]
    origin: Point
    angle: number

    constructor(origin: Point, parent: Node | null = null) {
        this.parent = parent
        this.origin = origin
        this.children = []
        if (parent) {
            this.angle = radianBetween(parent.origin, origin)
        } else {
            this.angle = 0
        }
    }

    private _randomTurn() {
        const angle = radian(between(0, 60))
        const direction = chance().num

        return angle * direction
    }

    public addChild() {
        const angle = this._randomTurn()
        const radius = between(10,50)

        const point = new Point(
            this.origin.x - (radius * Math.sin(angle)),
            this.origin.y - (radius * Math.cos(angle))
        )

        const child = new Node(point, this)
        this.children.push(child)
        return child
    }
}

export default Node