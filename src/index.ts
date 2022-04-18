import 'src/styles/main.scss'

import Canvas from './models/canvas'
import Point from './models/point'
import Animation from './models/animation'

import { between } from './utils/math'
import { r360 } from './utils/geometry'

interface Arc {
	color: string
	radius: number
	center: Point
	slope: Point
}

class App {
	el: HTMLDivElement
	canvas: Canvas
	arcs: Arc[]
	constructor(el: HTMLDivElement) {
		this.el = el
	}

	init() {
		this.canvas = new Canvas(this.el, { allowFullscreen: true })
		this.generate()

		this.canvas.afterResize = () => {
			this.canvas.render()
		}
		this.canvas.beforeRender = () => {
			this.canvas.clear()
		}

		window.addEventListener('resize', () => {
			this.canvas.resize()
		})
		window.addEventListener('mouseup', () => {
			this.generate()
		})

		const framerate = 100
		const animate = new Animation(() => {
			this.canvas.layers = []
			this.arcs = this.arcs.map((arc: Arc) => {
				const {
					slope,
					center: { x, y },
					radius,
					color,
				} = arc
				this.canvas.layers.push(() => {
					this.canvas.ctx.fillStyle = color
					this.canvas.ctx.beginPath()
					this.canvas.ctx.moveTo(x, y)
					this.canvas.ctx.arc(x, y, radius, 0, r360)
					this.canvas.ctx.fill()
				})

				arc.center.x += slope.x
				arc.center.y += slope.y

				switch (arc.center.atEdgeOf(this.canvas.bounds)) {
					case 'top':
					case 'bottom':
						arc.slope.y *= -1
						arc.slope.x *= -1
					case 'left':
					case 'right':
						arc.slope.x *= -1
					default:
						break
				}
				return arc
			})
			this.canvas.render()
		}, framerate)

		animate.start()
	}

	generate() {
		const arcs = []

		const {
			bounds: { left, right, top, bottom, width, height },
		} = this.canvas
		for (let i = 0; i < 500; i++) {
			const radius = between(10, 50)
			const margin = radius + 10
			const max = 0.001
			const min = max * -1
			arcs.push({
				color: '#' + ['', '', ''].map(() => between(0, 255).toString(16)).join(''),
				center: new Point(between(left + margin, right - margin), between(top + margin, bottom - margin)),
				slope: new Point(between(width * min, width * max, 2), between(height * min, height * max, 2)),
				radius,
			})
		}

		this.arcs = arcs
	}
}

export default App
