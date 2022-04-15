import Point from './point'
import Bounds from './bounds'

export interface CanvasOptions {
	name?: string
}

export type RenderFunction = () => void

class Canvas {
	parent: HTMLDivElement
	el: HTMLCanvasElement
	ctx: CanvasRenderingContext2D

	dpi: number = 2
	layers: RenderFunction[] = []
	height: number = 0
	width: number = 0
	bounds: Bounds = new Bounds()

	constructor(parent: HTMLDivElement, options: CanvasOptions) {
		this.parent = parent
		this.el = document.createElement('canvas')
		this.el.classList.add('canvas-model')
		if (options.name) {
			this.el.classList.add(options.name)
		}
		this.ctx = this.el.getContext('2d') || ({} as CanvasRenderingContext2D)
		this.parent.appendChild(this.el)

		this.el.style.position = 'absolute'
		this.el.style.top = '0px'
		this.el.style.left = '0px'
		this.el.style.zIndex = '1'

		this.resize()
	}

	public beforeResize() {}
	public resize() {
		this.beforeResize()

		this.height = this.parent.clientHeight
		this.width = this.parent.clientWidth
		this.bounds.bottomRight = new Point(this.width, this.height)

		this.el.width = this.width * this.dpi
		this.el.height = this.height * this.dpi
		this.el.style.width = `${this.width}px`
		this.el.style.height = `${this.height}px`

		this.ctx.scale(this.dpi, this.dpi)
		this.ctx.save()

		this.afterResize()
	}
	public afterResize() {}

	public beforeRender() {}
	public render() {
		this.beforeRender()
		this.layers.forEach((layer: RenderFunction) => {
			layer()
		})
		this.afterRender()
	}
	public afterRender() {}

	public clear() {
		this.ctx.clearRect(0, 0, this.width, this.height)
	}
}

export default Canvas
