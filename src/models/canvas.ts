import Point from 'src/models/point'

export interface CanvasOptions {
	width?: number
	height?: number
	dpi?: number
	zIndex?: number
}

class Canvas {
	ctx: CanvasRenderingContext2D
	dpi: number
	container: HTMLDivElement
	el: HTMLCanvasElement
	center: Point
	height: number
	width: number
	zIndex: number

	constructor(container: HTMLDivElement, options: CanvasOptions) {
		this.container = container
		this.container.style.position = 'relative'

		this.el = document.createElement('canvas')
		this.el.style.position = 'absolute'
		this.el.style.top = '0'
		this.el.style.left = '0'
		this.el.style.zIndex = this.zIndex + ''
		this.el.style.cursor = 'none'

		this.container.appendChild(this.el)
		this.ctx = this.el.getContext('2d')

		this.resize(options)
	}

	public resize(options: CanvasOptions) {
		this.height = options.height || this.container.clientHeight
		this.width = options.width || this.container.clientWidth
		this.center = new Point(this.width / 2, this.height / 2)

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
