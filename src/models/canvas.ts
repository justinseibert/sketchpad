import Point from './point'
import Bounds from './bounds'

import fullscreenIcon from '../styles/icon/fullscreen.svg'

export interface CanvasOptions {
	name?: string
	allowFullscreen?: boolean | Element
}

export type RenderFunction = () => void

class Canvas {
	parent: HTMLDivElement
	el: HTMLCanvasElement
	controls: HTMLDivElement
	ctx: CanvasRenderingContext2D
	fullscreenTarget: Element

	dpi: number = 2
	layers: RenderFunction[] = []
	height: number = 0
	width: number = 0
	bounds: Bounds = new Bounds()

	controlTimer: number = 0

	constructor(parent: HTMLDivElement, options: CanvasOptions) {
		this.parent = parent
		this.el = document.createElement('canvas')
		this.ctx = this.el.getContext('2d') || ({} as CanvasRenderingContext2D)

		this.el.style.position = 'absolute'
		this.el.style.top = '0px'
		this.el.style.left = '0px'
		this.el.style.zIndex = '0'

		const container = document.createElement('div')
		container.style.position = 'relative'
		container.style.width = '100%'
		container.style.height = '100%'
		container.classList.add('canvas-model')
		if (options.name) {
			container.classList.add(options.name)
		}
		container.appendChild(this.el)

		if (!!options.allowFullscreen) {
			this.controls = document.createElement('div')
			this.controls.classList.add('control-container')

			const fullscreen = document.createElement('a')
			fullscreen.classList.add('icon')
			fullscreen.innerHTML = fullscreenIcon
			fullscreen.addEventListener('click', () => this.toggleFullscreen())

			this.controls.appendChild(fullscreen)
			container.append(this.controls)

			if (typeof options.allowFullscreen === 'boolean') {
				this.fullscreenTarget = document.documentElement
			} else {
				this.fullscreenTarget = options.allowFullscreen
			}
		}
		this.parent.appendChild(container)
		container.addEventListener('mousemove', () => this.toggleControls())
		this.resize()
	}

	public toggleControls() {
		clearTimeout(this.controlTimer)
		this.el.classList.remove('-hide-cursor')
		this.controls.classList.add('-show')
		this.controls.classList.remove('-hide')

		this.controlTimer = window.setTimeout(() => {
			this.el.classList.add('-hide-cursor')
			this.controls.classList.add('-hide')
			this.controls.classList.remove('-show')
		}, 3000)
	}

	public beforeFullscreenEnter() {}
	public beforeFullscreenExit() {}
	public async toggleFullscreen() {
		if (document.fullscreenElement) {
			this.beforeFullscreenExit()
			await document.exitFullscreen()
			this.afterFullscreenExit()
		} else {
			this.beforeFullscreenEnter()
			await this.fullscreenTarget.requestFullscreen()
			this.afterFullscreenEnter()
		}
	}
	public afterFullscreenEnter() {}
	public afterFullscreenExit() {}

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
