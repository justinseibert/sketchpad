import randomColor from 'randomColor'
import { random } from 'lodash'

import Canvas from 'src/models/canvas'
import Circle from 'src/models/circle'
import Arc from 'src/models/arc'
import Point from 'src/models/point'

import { radian } from 'src/utils/geometry'

import { CanvasOptions } from 'src/types/canvas'

class Metaball extends Canvas {
    circles: Circle[]
    activeIndex: number
    isMouseDown: boolean
    mouse: Point
    colors: string[]

    constructor(el: HTMLCanvasElement, options: CanvasOptions) {
        super(el, options)

        this.circles = []
        this.colors = []
        for (let i = 0; i < 10; i++) {
            const r = 40 + (5 * i)
            const x = random(r, this.width - r)
            const y = random(r, this.height - r)
            this.circles.push(new Circle(x,y,r))
        }
        this.activeIndex = -1
        this.isMouseDown = false
        this.mouse = new Point()

        this.el.addEventListener('mousedown', (event: MouseEvent) => this._handleMouseDown(event))
        this.el.addEventListener('mouseup', () => this._handleMouseUp())
        this.el.addEventListener('mousemove', (event: MouseEvent) => this._handleMouseMove(event))
    }

    private _handleMouseDown(event: MouseEvent) {
        this.isMouseDown = true
        
        this.mouse.x = event.offsetX
        this.mouse.y = event.offsetY

        this.activeIndex = this.circles.findIndex((circle: Circle) => {
            return circle.isPointInside(this.mouse)
        })
    }

    private _handleMouseUp() {
        this.isMouseDown = false
        this.activeIndex = null

        this.render()
    }

    private _handleMouseMove(event: MouseEvent) {
        if (!this.isMouseDown || this.activeIndex < 0) {
            return
        }
        this.circles[this.activeIndex].center.x += event.movementX
        this.circles[this.activeIndex].center.y += event.movementY
        
        this.render()
    }

    private color(index: number) {
        if (index > this.colors.length - 1) {
            this.colors[index] = randomColor({
                seed: (index + 3) * 256,
                luminosity: 'light',
            })
        }
        return this.colors[index]
    }

    private resolveCluster(parent: Circle, candidates: Circle[]) {
        // determines single cluster from candidate pool
        const cluster: Circle[] = [ parent ]
        let remainder: Circle[] = []

        while (candidates.length) {
            const latest = candidates.pop()
            if (parent.doesIntersectWith(latest)) {
                // candidates and remainder are combined
                // the latest is therefore tested against everything but it's known parents
                const [ subCluster, subRemainder ] = this.resolveCluster(latest, [ ...candidates, ...remainder ])
                // add the new subcluster to existing cluster
                // at the very least, this adds the latest to the cluster
                cluster.push(...subCluster)
                // reset the possible candidate pool to only those that were not matched in the subcluster
                // new pool should be less than or equal to current candidates depending on matches
                candidates = subRemainder
                // clear the remainder because we are now testing the same parent against a new candidate pool
                // ensures we do not duplicate items in the remainder
                remainder = []
            } else {
                // add any circles that do not intersect with current parent from possible candidate pool
                remainder.push(latest)
            }
        }
        // cluster has technically been a comparison of one parent circle to everything else
        // remainder will include results if something didn't match and be retested by the getter loop
        return [ cluster, remainder ]
    }

    private get clusters(): Circle[][] {
        // gets all clusters from dynamic candidate pool
        const clusters: Circle[][] = []
        let candidates = [ ...this.circles ]
        while (candidates.length) {
            // test all possible connected circles against one
            const parent = candidates.pop()
            const [ cluster, remainder ] = this.resolveCluster(parent, candidates)
            clusters.push(cluster)
            // ignore the circles that were part of the recent cluster
            // re-run test only againt the remaining
            candidates = remainder
        }
        return clusters
    }

    private label(text: any, position: Point) {
        this.ctx.save()
        this.ctx.fillStyle = '#fff'
        this.ctx.fillText(text.toString(), position.x, position.y)
        this.ctx.restore()
    }

    public render() {
        this.clear()
        const r360 = radian(360)
        const threshold = 100

        this.ctx.lineWidth = 1
        this.clusters.forEach((cluster: Circle[], index: number) => {
            this.ctx.strokeStyle = this.color(index + 1)
            cluster.forEach((circle: Circle) => {
                this.ctx.beginPath()
                this.ctx.arc(...circle.canvasArgs)
                this.ctx.stroke()
            })
        })
    }
}

export default Metaball