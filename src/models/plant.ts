import Point from 'src/models/point'
import Node from 'src/models/node'
import Canvas from 'src/models/canvas'

import { between } from 'src/utils/math'

class Plant {
    canvas: Canvas
    nodes: Node

    constructor(canvas: Canvas) {
        const stem = new Point(
            canvas.center.x,
            canvas.height,
        )
        this.nodes = new Node(stem)
        this.canvas = canvas
    }

    private _determineNext(nodes: Node[]) {
        const index = between(0, nodes.length - 1)
        return nodes[index]
    }

    private _traverseStem() {
        let isTraversing = true
        let node = this.nodes
        while (isTraversing) {
            if (node.children.length < 2) {
                node = node.addChild()
                isTraversing = false
            } else {
                node = this._determineNext(node.children)
            }
        }
        return node
    }

    public grow() {
        const { ctx } = this.canvas
        let node = this._traverseStem()
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 1
        ctx.lineCap = 'round'
        while (node.parent) {
            ctx.beginPath()
            ctx.moveTo(node.origin.x, node.origin.y)
            ctx.lineTo(node.parent.origin.x, node.parent.origin.y)
            ctx.stroke()
            node = node.parent
        }
    }

}

export default Plant