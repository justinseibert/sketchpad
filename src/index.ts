import './styles/main.scss'

import Canvas from './models/canvas'
import Point, { PointType } from './models/point'
import Animation from './models/animation'

import { between, chance } from './utils/math'
import { r360, radianBetween, rotatePoint } from './utils/geometry'
import Color from './models/color'

interface Arc {
	growth: number
	color: Color[]
	radius: number
	center: Point
	slope: Point
	ramp: number
}

class App {
	el: HTMLDivElement
	canvas: Canvas
	arcs: Arc[]
	angle: number = 0
	background: Color[]
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
			this.setAngle(event)
		})
		this.canvas.el.addEventListener('mouseover', (event) => {
			this.setAngle(event)
		})

		const animate = new Animation(() => this.stepAnimation(), 100)
		animate.start()
	}

	stepAnimation() {
		this.canvas.layers = []
		this.arcs = this.arcs.map((arc: Arc) => {
			const {
				slope,
				center,
				center: { x, y },
				radius,
				color,
				growth,
			} = arc
			this.canvas.layers.push(() => {
				const gradient = this.generateGradient(
					center,
					radius,
					color.map((obj: Color) => {
						obj.h += arc.ramp
						return obj
					})
				)

				this.canvas.ctx.fillStyle = gradient
				this.canvas.ctx.beginPath()
				this.canvas.ctx.arc(x, y, radius, 0, r360)
				this.canvas.ctx.fill()
				this.canvas.ctx.closePath()
			})

			arc.center.x += slope.x
			arc.center.y += slope.y

			if (arc.radius < 10) {
				arc.growth = 1
			} else if (arc.radius > 50) {
				arc.growth = -1
			}
			arc.radius += arc.growth * 0.1

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
	}

	setAngle(event: MouseEvent) {
		this.angle = radianBetween(
			{ x: this.canvas.bounds.center.x, y: this.canvas.bounds.bottom * 3 },
			{ x: event.clientX, y: event.clientY }
		)
	}

	generateGradient(origin: PointType, radius: number, colors: Color[]) {
		const { x, y } = origin
		const start = rotatePoint(origin, { x: x - radius, y }, this.angle)
		const end = rotatePoint(origin, { x: x + radius, y }, this.angle)
		const gradient = this.canvas.ctx.createLinearGradient(start.x, start.y, end.x, end.y)
		gradient.addColorStop(0, colors[0].toString() || '')
		gradient.addColorStop(1, colors[1].toString() || '')

		return gradient
	}

	generate() {
		const {
			bounds: { left, right, top, bottom, height },
		} = this.canvas

		const backgroundHue = between(0, 360)
		this.background = [
			new Color({ h: backgroundHue, s: between(50, 75), l: between(20, 40) }),
			new Color({ h: backgroundHue, s: between(75, 100), l: between(80, 100) }),
		]

		const arcs = []
		const max = 0.001
		const min = max * -1
		const hue = between(0, 360)
		const hueRange = 60
		const total = 600
		for (let i = 0; i < total; i++) {
			const radius = between(10, 50)
			const h = between(hue, hue + hueRange)
			arcs.push({
				growth: chance().num,
				color: [new Color({ h, l: 30 + between(0, 30) }), new Color({ h, l: 40 + between(40, 50) })],
				center: new Point(between(left - radius, right + radius), between(top + radius, bottom - radius)),
				slope: new Point(between(-1, 2), between(height * min, height * max, 2)),
				radius,
				ramp: between(0.01, 0.05, 2),
			})
		}

		this.arcs = arcs
	}
}

export default App
