import Point from 'src/models/point'
import Node from 'src/models/node'
import Canvas from 'src/models/canvas'

import { between, chance } from 'src/utils/math'

import { CanvasOptions } from 'src/types/canvas'

class Plant extends Canvas {
    nodes: Node

    constructor(el: HTMLCanvasElement, options: CanvasOptions) {
        super(el, options)
        
        const stem = new Point(
            this.center.x,
            this.height,
        )
        this.nodes = new Node(stem)
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
        let node = this._traverseStem()
        this.ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        this.ctx.lineWidth = 1
        this.ctx.lineCap = 'round'
        while (node.parent) {
            this.ctx.beginPath()
            this.ctx.moveTo(node.origin.x, node.origin.y)
            this.ctx.lineTo(node.parent.origin.x, node.parent.origin.y)
            this.ctx.stroke()
            node = node.parent
        }
    }

}

export default Plant