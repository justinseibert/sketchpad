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
        for (let i = 0; i < 6; i++) {
            const r = 40 + (5 * i)
            const x = random(r, this.width - r)
            const y = random(r, this.height - r)
            this.circles.push(new Circle(x,y,r))
        }
        this.activeIndex = -1
        this.isMouseDown = false
        this.mouse = new Point()
        
        this.colors = []
        for (let i = 0; i < 10; i++) {
            this.colors.push(randomColor())
        }

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
            this.colors[index] = randomColor({ seed: index })
        }
        return this.colors[index]
    }

    private get clusters(): Circle[][] {
        const candidates = [ ...this.circles ]
        const log = (arr: Circle[]) => {
            console.log(arr.map((c:Circle) => c.radius))
        }

        const getCluster = (parent: Circle, subCandidates: Circle[]) => {
            const intersecting: Circle[] = [ parent ]
            const uncategorized: Circle[] = []
            while (subCandidates.length) {
                const latest = subCandidates.pop()
                if (parent.doesIntersectWith(latest)) {
                    intersecting.push(...getCluster(latest, [ ...subCandidates, ...uncategorized ]))
                } else {
                    uncategorized.push(latest)
                }
            }
            log(uncategorized)
            return intersecting
        }

        const clusters: Circle[][] = []
        // while (candidates.length) {
            const parent = candidates.pop()
            clusters.push(getCluster(parent, candidates))
        // }
        return clusters
    }

    public render() {
        this.clear()
        const r360 = radian(360)
        const threshold = 100

        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = this.color(0)
        this.circles.forEach((circle: Circle) => {
            this.ctx.beginPath()
            const args = circle.canvasArgs
            args[2] -= 2
            this.ctx.arc(...args)
            this.ctx.stroke()

            this._label(circle.radius, circle.center)
        })

        if (!this.isMouseDown) {
            this.ctx.lineWidth = 3
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

    private _label(text: any, position: Point) {
        this.ctx.save()
        this.ctx.fillStyle = '#fff'
        this.ctx.fillText(text.toString(), position.x, position.y)
        this.ctx.restore()
    }
}

export default Metaball