import 'src/styles/main.scss'

import Canvas from 'src/models/canvas'
import { between } from './utils/math'
import { r360 } from './utils/geometry'

interface Arc {
	c: string
	x: number
	y: number
	r: number
}

class App {
	el: HTMLDivElement
	canvas: Canvas
	arcs: Arc[]
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
			this.canvas.clear()
		}

		window.addEventListener('resize', () => {
			this.canvas.resize()
		})
		window.addEventListener('mouseup', () => {
			this.generate()
		})
	}

	generate() {
		const arcs = []

		for (let i = 0; i < 1000; i++) {
			arcs.push({
				c: '#' + between(0, 255).toString(16).repeat(3),
				x: between(this.canvas.bounds.left, this.canvas.bounds.right),
				y: between(this.canvas.bounds.top, this.canvas.bounds.bottom),
				r: between(10, 50),
			})
		}

		this.arcs = arcs
		this.render()
	}

	render() {
		this.arcs.forEach(({ x, y, r, c }) => {
			this.canvas.layers.push(() => {
				this.canvas.ctx.fillStyle = c
				this.canvas.ctx.beginPath()
				this.canvas.ctx.moveTo(x, y)
				this.canvas.ctx.arc(x, y, r, 0, r360)
				this.canvas.ctx.fill()
			})
		})

		this.canvas.render()
	}
}

export default App
