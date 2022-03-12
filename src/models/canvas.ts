import Color from 'src/models/color'
import Point from 'src/models/point'

class Canvas {
	ctx: CanvasRenderingContext2D
	dpi: number
	parent: HTMLDivElement
	el: HTMLCanvasElement
	margin: number
	center: Point
	color: Color
	height: number
	width: number

	constructor(parent: HTMLDivElement) {
		this.parent = parent
		this.el = document.createElement('canvas')
		this.parent.appendChild(this.el)

		this.center = new Point(parent.clientWidth / 2, parent.clientHeight / 2)
		this.color = new Color({
			h: 30,
			s: 7,
			l: 17,
		})
		this.ctx = this.el.getContext('2d')
		this.dpi = 2
		this.height = parent.clientHeight
		this.margin = -3
		this.width = parent.clientWidth
	}

	init() {
		this.el.width = this.width * this.dpi
		this.el.height = this.height * this.dpi
		this.el.style.width = `${this.width}px`
		this.el.style.height = `${this.height}px`

		this.ctx.scale(this.dpi, this.dpi)
		this.ctx.save()
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height)
	}
}

export default Canvas
