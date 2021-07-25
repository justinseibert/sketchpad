import { sumBy, random } from 'lodash'

import Point from 'src/models/point'
import Node from 'src/models/node'
import Canvas from 'src/models/canvas'

import { chance } from 'src/utils/math'

class Plant {
    canvas: Canvas
    nodeTree: Node

    constructor(canvas: Canvas) {
        const stem = new Point(
            canvas.center.x,
            canvas.height,
        )
        this.nodeTree = new Node(stem)
        this.canvas = canvas
    }

    private _addStem() {
        let isTraversing = true
        let node = this.nodeTree
        while (isTraversing) {
            if (node.children.length < 4) {
                node = node.addChild()
                isTraversing = false
            } else {
                const weightSum = sumBy(node.children, 'weight')
                const index = node.children.findIndex((child: Node) => {
                    return chance(child.weight / weightSum).bool
                })
                node = node.children[index > -1 ? index : 0]
            }
        }
        return node
    }

    public grow() {
        const { ctx } = this.canvas
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 1
        ctx.lineCap = 'round'
        
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