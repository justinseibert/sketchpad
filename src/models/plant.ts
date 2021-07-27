import { minBy } from 'lodash'

import Point from 'src/models/point'
import Node from 'src/models/node'
import Sun from 'src/models/sun'
import Canvas from 'src/models/canvas'

import { chance } from 'src/utils/math'

class Plant {
    canvas: Canvas
    nodeTree: Node
    nodeCount: number
    maxBranching: number
    sun: Sun

    constructor(canvas: Canvas, sun: Sun) {
        const stem = new Point(
            canvas.center.x,
            canvas.height,
        )
        this.nodeTree = new Node(stem)
        this.nodeCount = 1
        this.maxBranching = 2
        this.canvas = canvas
        this.sun = sun
    }

    private _addStem() {
        let traversal = 0
        let node = this.nodeTree
        while (traversal < this.nodeCount) {
            const childCount = node.children.length
            if (childCount < this.maxBranching) {
                return node.addChild(this.sun)
            } else {
                if (chance(0.9).bool) {
                    // either find child node closest to sun
                    node = minBy(node.children, (child: Node) => {
                        const distance = child.origin.distanceFrom(this.sun.position)
                        return distance 
                    })
                } else {
                    // or some percentage of the time, choose the smallest branch
                    node = minBy(node.children, (child: Node) => {
                        return child.weight
                    })
                }
            }
            traversal ++
        }
        return node
    }

    public grow() {
        const { ctx } = this.canvas
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'rgba(220,220,220,1)'
        
        let node = this._addStem()
        if (!node) {
            return
        }

        this.nodeCount ++
        const baseWeight = this.nodeTree.children[0].weight
        const maxWeight = this.nodeCount / baseWeight * 10
        while (node.parent) {
            ctx.lineWidth = maxWeight * (node.weight / (baseWeight + maxWeight))
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