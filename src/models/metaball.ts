import randomColor from 'randomColor'
import { random } from 'lodash'

import Canvas from 'src/models/canvas'
import Circle from 'src/models/circle'
import Arc from 'src/models/arc'
import Point from 'src/models/point'

import { CanvasOptions } from 'src/types/canvas'

interface Intersector {
	points: Point[]
	circle: Circle
}

export interface ClusterOptions {
	count?: number
	size?: number
	range?: number
	minCluster?: number
	showOriginal?: boolean
	levels?: number
	spread?: number
}

class Metaball extends Canvas {
	circles: Circle[] = []
	colors: string[] = []

	activeIndex: number = -1
	isMouseDown: boolean = false
	mouse: Point = new Point()

	private _size: number = 40
	private _range: number = 5
	private _count: number = 0
	private _minCluster: number = 0
	private _showOriginal: boolean = true
	private _levels: number = 1
	private _spread: number = 1

	constructor(el: HTMLCanvasElement, options: CanvasOptions, clusterOptions: ClusterOptions) {
		super(el, options)

		this.showOriginal = clusterOptions.showOriginal
		this.minCluster = clusterOptions.minCluster || 0
		this.spread = clusterOptions.spread || 1
		this.levels = clusterOptions.levels || 1
		this.size = clusterOptions.size || 40
		this.range = clusterOptions.range || 5
		this.count = clusterOptions.count || 8

		this.el.addEventListener('mousedown', (event: MouseEvent) => this.handleMouseDown(event))
		this.el.addEventListener('mouseup', () => this.handleMouseUp())
		this.el.addEventListener('mousemove', (event: MouseEvent) => this.handleMouseMove(event))
	}

	public init() {
		this.circles = []
		for (let i = 0; i < this.count; i++) {
			const r = this.size + this.range * i
			const x = random(r, this.width - r)
			const y = random(r, this.height - r)
			this.circles.push(new Circle(x, y, r))
		}
		this.render()
	}

	public get count() {
		return this._count
	}
	public set count(value: number) {
		this._count = value
		const delta = value - this.circles.length

		if (delta > 0) {
			for (let i = this.circles.length; i < value; i++) {
				const r = this.size + this.range * i
				const x = random(r, this.width - r)
				const y = random(r, this.height - r)
				this.circles.push(new Circle(x, y, r))
			}
			this.render()
		} else if (delta < 0) {
			this.circles = this.circles.slice(0, delta)
			this.render()
		}
	}

	public get size() {
		return this._size
	}
	public set size(value: number) {
		this._size = value
		this.circles = this.circles.map((circle: Circle, i: number) => {
			circle.radius = value + this.range * i
			return circle
		})
		this.render()
	}

	public get range() {
		return this._range
	}
	public set range(value: number) {
		this._range = value
		this.circles = this.circles.map((circle: Circle, i: number) => {
			circle.radius = this.size + value * i
			return circle
		})
		this.render()
	}

	public get levels() {
		return this._levels
	}
	public set levels(value: number) {
		this._levels = value
		this.render()
	}

	public get spread() {
		return this._spread
	}
	public set spread(value: number) {
		this._spread = value
		this.render()
	}

	public get minCluster() {
		return this._minCluster
	}
	public set minCluster(value: number) {
		this._minCluster = value
		this.render()
	}

	public get showOriginal() {
		return this._showOriginal
	}
	public set showOriginal(value: boolean) {
		this._showOriginal = value
		this.render()
	}

	private handleMouseDown(event: MouseEvent) {
		this.isMouseDown = true

		this.mouse.x = event.offsetX
		this.mouse.y = event.offsetY

		this.activeIndex = this.circles.findIndex((circle: Circle) => {
			return circle.isPointInside(this.mouse)
		})
	}

	private handleMouseUp() {
		this.isMouseDown = false
		this.activeIndex = null

		this.render()
	}

	private handleMouseMove(event: MouseEvent) {
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
		const cluster: Circle[] = [parent]
		let remainder: Circle[] = []

		while (candidates.length) {
			const latest = candidates.pop()
			if (parent.doesIntersectWith(latest)) {
				// candidates and remainder are combined
				// the latest is therefore tested against everything but it's known parents
				const [subCluster, subRemainder] = this.resolveCluster(latest, [...candidates, ...remainder])
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
		return [cluster, remainder]
	}

	private getClusters(candidates: Circle[]): Circle[][] {
		// gets all clusters from dynamic candidate pool
		const clusters: Circle[][] = []
		while (candidates.length) {
			// test all possible connected circles against one
			const parent = candidates.pop()
			const [cluster, remainder] = this.resolveCluster(parent, candidates)
			clusters.push(cluster)
			// ignore the circles that were part of the recent cluster
			// re-run test only againt the remaining
			candidates = remainder
		}
		return clusters
	}

	private firstExterior(intersectors: Intersector[]) {
		return intersectors.find((current: Intersector, selfIndex: number) => {
			const [point] = current.points
			const isInteriorPoint =
				intersectors.findIndex(({ circle }: Intersector, index: number) => {
					if (index === selfIndex) {
						// ignore own circle
						return false
					}
					// check if the clockwise point is inside of another intersecting circle
					const isInterior = circle.isPointInside(point)
					return isInterior
				}) > -1
			if (isInteriorPoint) {
				return false
			}
			return true
		})
	}

	private smallestClockwiseRotation(parent: Circle, startingPoint: Point, intersectors: Intersector[]) {
		let intersector = intersectors[0]
		// console.log(intersectors)
		let minAngle = parent.center.radianBetween(startingPoint, intersector.points[1], true)

		intersectors.forEach((current: Intersector) => {
			const angle = parent.center.radianBetween(startingPoint, current.points[1], true)
			if (angle < minAngle) {
				// update for smallest known angle
				minAngle = angle
				intersector = current
			}
		})
		return intersector
	}

	private getArcs(parent: Circle, candidates: Circle[], starting: Intersector | null, closing: Point | null): Arc[] {
		const arcs: Arc[] = []
		const intersectors: Intersector[] = []

		// find all the circles that intersect with the current parent
		candidates.forEach((circle: Circle) => {
			if (parent.isSimilarTo(circle)) {
				return
			}
			const points = parent.intersectionsWith(circle)
			if (points.length) {
				intersectors.push({
					points,
					circle,
				})
			}
		})

		// return a contained circle if no intersections
		if (!intersectors.length) {
			arcs.push(
				new Arc(
					parent.center,
					new Point(parent.center.x + parent.radius, parent.center.y),
					new Point(parent.center.x + parent.radius, parent.center.y - 0.0001),
					parent.radius
				)
			)
			return arcs
		}

		starting = starting || this.firstExterior(intersectors)
		const ending = this.smallestClockwiseRotation(parent, starting.points[0], intersectors)

		arcs.push(new Arc(parent.center, starting.points[0], ending.points[1], parent.radius))

		if (!closing) {
			closing = starting.points[0]
		} else if (closing.isSimilarTo(ending.points[1])) {
			return arcs
		}

		const [clock, anticlock] = ending.points
		ending.points = [anticlock, clock]

		arcs.push(...this.getArcs(ending.circle, candidates, ending, closing))

		return arcs
	}

	private label(text: any, position: Point) {
		this.ctx.save()
		this.ctx.fillStyle = '#fff'
		this.ctx.fillText(text.toString(), position.x, position.y)
		this.ctx.restore()
	}

	public render() {
		this.clear()

		this.ctx.lineWidth = 1
		if (this.showOriginal || this.isMouseDown) {
			this.ctx.strokeStyle = '#3f3f3f'
			this.circles.forEach((circle: Circle) => {
				this.ctx.beginPath()
				this.ctx.arc(...circle.canvasArgs)
				this.ctx.stroke()
			})
		}

		if (this.isMouseDown) {
			return
		}

		for (let i = 0; i < this.levels; i++) {
			const circles = this.generateRings(i)
			this.drawClusters(circles)
		}
	}

	private generateRings(level: number): Circle[] {
		return this.circles.map((circle: Circle) => {
			return new Circle(circle.center.x, circle.center.y, circle.radius + level * (10 + level * this.spread))
			})
	}

	private drawClusters(circles: Circle[]) {
			const clusters = this.getClusters(circles)
			clusters.forEach((cluster: Circle[], i: number) => {
				this.ctx.strokeStyle = this.color(i + 1)
				if (cluster.length > this.minCluster) {
					const arcs = this.getArcs(cluster[0], cluster, null, null)
					arcs.forEach((arc: Arc) => {
						this.ctx.beginPath()
						this.ctx.arc(...arc.canvasArgs)
						this.ctx.stroke()
					})
				}
			})
	}
}

export default Metaball
