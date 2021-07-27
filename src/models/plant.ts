import { minBy, sumBy, random } from 'lodash'

import Point from 'src/models/point'
import Node from 'src/models/node'
import Sun from 'src/models/sun'
import Canvas from 'src/models/canvas'

import { chance } from 'src/utils/math'

class Plant {
    canvas: Canvas
    nodeTree: Node
    nodeCount: number
    sun: Sun

    constructor(canvas: Canvas, sun: Sun) {
        const stem = new Point(
            canvas.center.x,
            canvas.height,
        )
        this.nodeTree = new Node(stem)
        this.nodeCount = 1
        this.canvas = canvas
        this.sun = sun
    }

    private _addStem() {
        let traversal = 0
        let node = this.nodeTree
        while (traversal < this.nodeCount) {
            if (node.children.length < 4) {
                return node.addChild(this.sun)
            } else {
                // find child node closest to sun
                node = minBy(node.children, (child: Node) => {
                    const distance = child.origin.distanceFrom(this.sun.position)
                    return distance 
                })
            }
            traversal ++
        }
        return node
    }

    public grow() {
        const { ctx } = this.canvas
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'rgba(255,255,255,1)'
        
        let node = this._addStem()
        if (!node) {
            return
        }

        this.nodeCount ++
        const maxWeight = this.nodeTree.children[0].weight
        while (node.parent) {
            ctx.lineWidth = 16 * (node.weight / maxWeight)
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