import Color from 'src/models/color'
import Point from 'src/models/point'

export interface CanvasOptions {
	width?: number
	height?: number
	dpi?: number
}

class Canvas {
	ctx: CanvasRenderingContext2D
	dpi: number
	parent: HTMLDivElement
	el: HTMLCanvasElement
	center: Point
	height: number
	width: number

	constructor(parent: HTMLDivElement, options: CanvasOptions) {
		this.parent = parent
		this.el = document.createElement('canvas')
		this.parent.appendChild(this.el)

		this.resize(options)
	}

	public resize(options: CanvasOptions) {
		this.height = options.height || this.parent.clientHeight
		this.width = options.width || this.parent.clientWidth
		this.center = new Point(this.width / 2, this.height / 2)

		this.ctx = this.el.getContext('2d')
		this.dpi = options.dpi || this.dpi || 2

		this.el.width = this.width * this.dpi
		this.el.height = this.height * this.dpi
		this.el.style.width = `${this.width}px`
		this.el.style.height = `${this.height}px`

		this.ctx.scale(this.dpi, this.dpi)
		this.ctx.save()
	}

	public clear() {
		this.ctx.clearRect(0, 0, this.width, this.height)
	}
}

export default Canvas
