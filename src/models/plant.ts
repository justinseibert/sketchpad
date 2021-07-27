import { minBy, sumBy, random } from 'lodash'

import Point from 'src/models/point'
import Node from 'src/models/node'
import Sun from 'src/models/sun'
import Canvas from 'src/models/canvas'

import { chance } from 'src/utils/math'

class Plant {
    canvas: Canvas
    nodeTree: Node
    sun: Sun

    constructor(canvas: Canvas, sun: Sun) {
        const stem = new Point(
            canvas.center.x,
            canvas.height,
        )
        this.nodeTree = new Node(stem)
        this.canvas = canvas
        this.sun = sun
    }

    private _addStem() {
        let isTraversing = true
        let node = this.nodeTree
        while (isTraversing) {
            if (node.children.length < 4) {
                node = node.addChild(this.sun.position)
                isTraversing = false
            } else {
                // find child node closest to sun
                node = minBy(node.children, (child: Node) => {
                    return child.origin.distanceFrom(this.sun.position)
                })
            }
        }
        return node
    }

    public grow() {
        const { ctx } = this.canvas
        ctx.lineWidth = 1
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        
        let node = this._addStem()
        while (node.parent) {
            ctx.beginPath()
            ctx.moveTo(node.origin.x, node.origin.y)
            ctx.lineTo(node.parent.origin.x, node.parent.origin.y)
            ctx.stroke()
            node.addWeight()
            node = node.parent
        }
    }

}

export default Plant