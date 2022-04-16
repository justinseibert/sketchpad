import './styles/main.scss'

import Canvas from './models/canvas'
import Point, { PointType } from './models/point'
import Animation from './models/animation'

import { between } from './utils/math'
import { r360, radianBetween, rotatePoint } from './utils/geometry'
import Color from './models/color'

interface Arc {
	color: string[]
	radius: number
	center: Point
	slope: Point
}

class App {
	el: HTMLDivElement
	canvas: Canvas
	arcs: Arc[]
	angle: number = 0
	background: string[]
	constructor(el: HTMLDivElement) {
		this.el = el
	}

	init() {
		this.canvas = new Canvas(this.el, {})
		this.generate()

		this.canvas.afterResize = () => {
			this.canvas.render()
		}
		this.canvas.beforeRender = () => {
			const {
				bounds: { width, height, bottom, center },
			} = this.canvas

			const gradient = this.generateGradient({ x: center.x, y: bottom }, Math.max(width, height), this.background)

			this.canvas.ctx.fillStyle = gradient
			this.canvas.ctx.fillRect(0, 0, this.canvas.bounds.width, this.canvas.bounds.height)
		}

		window.addEventListener('resize', () => {
			this.canvas.resize()
		})
		window.addEventListener('mouseup', () => {
			this.generate()
		})
		this.canvas.el.addEventListener('mousemove', (event) => {
			this.angle = radianBetween(
				{ x: this.canvas.bounds.center.x, y: this.canvas.bounds.bottom * 1.5 },
				{ x: event.clientX, y: event.clientY }
			)
		})

		const framerate = 100
		const animate = new Animation(() => {
			this.canvas.layers = []
			this.arcs = this.arcs.map((arc: Arc) => {
				const {
					slope,
					center,
					center: { x, y },
					radius,
					color,
				} = arc
				this.canvas.layers.push(() => {
					const gradient = this.generateGradient(center, radius, color)

					this.canvas.ctx.fillStyle = gradient
					this.canvas.ctx.beginPath()
					this.canvas.ctx.arc(x, y, radius, 0, r360)
					this.canvas.ctx.fill()
					this.canvas.ctx.closePath()
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

	generateGradient(origin: PointType, radius: number, colors: string[]) {
		const { x, y } = origin
		const start = rotatePoint(origin, { x: x - radius, y }, this.angle)
		const end = rotatePoint(origin, { x: x + radius, y }, this.angle)
		const gradient = this.canvas.ctx.createLinearGradient(start.x, start.y, end.x, end.y)
		gradient.addColorStop(0, colors[0] || '')
		gradient.addColorStop(1, colors[1] || '')

		return gradient
	}

	generate() {
		const {
			bounds: { left, right, top, bottom, height },
		} = this.canvas

		const backgroundHue = between(0, 360)
		this.background = [
			new Color({ h: backgroundHue, s: between(50, 75), l: between(20, 40) }).toString(),
			new Color({ h: backgroundHue, s: between(75, 100), l: between(80, 100) }).toString(),
		]

		const arcs = []
		const max = 0.01
		const min = max * -1
		const hue = between(0, 360)
		const hueRange = 60
		const total = 600
		for (let i = 0; i < total; i++) {
			const radius = between(10, 50)
			const h = between(hue, hue + hueRange)
			arcs.push({
				color: [
					new Color({ h, l: 30 + between(0, 30) }).toString(),
					new Color({ h, l: 40 + between(40, 50) }).toString(),
				],
				center: new Point(between(left - radius, right + radius), between(top + radius, bottom - radius)),
				slope: new Point(between(-1, 2), between(height * min, height * max, 2)),
				radius,
			})
		}

		this.arcs = arcs
	}
}

export default App
