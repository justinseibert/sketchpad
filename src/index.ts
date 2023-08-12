import 'src/styles/main.scss'

import GUI from 'lil-gui'

import Canvas from './models/canvas'
import Animation from './models/animation'
import Ring from './models/ring'

import { r360 } from './utils/geometry'
import CRGB from './models/crgb'

class App {
	el: HTMLDivElement
	canvas: Canvas
	animation: Animation
	gui: GUI
	ring: Ring

	settings = {
		dpi: 2,
		blur: 0,
		ringSize: 11,
		ringCount: 9,
	}

	constructor(el: HTMLDivElement) {
		this.el = el
		this.settings = {
			dpi: 0.3,
			blur: 3,
			ringSize: 11,
			ringCount: 8,
		}
	}

	init() {
		this.canvas = new Canvas(this.el, { allowFullscreen: true })
		this.canvas.dpi = this.settings.dpi
		this.canvas.ctx.filter = this.settings.blur > 0 ? `blur(${this.settings.blur}px)` : 'none'
		this.canvas.resize()

		this.canvas.beforeRender = () => {
			const {
				ctx,
				bounds: {
					center: { x, y },
				},
			} = this.canvas

			this.canvas.clear()
			this.canvas.ctx.fillStyle = CRGB.Black.toString()
			this.canvas.ctx.beginPath()
			this.canvas.ctx.moveTo(x, y)
			this.canvas.ctx.arc(x, y, this.ring.outerRadius, 0, r360)
			this.canvas.ctx.fill()
		}

		window.addEventListener('mouseup', () => {
			// start or stop animation
			this.animation.toggle()
		})

		this.ring = new Ring()
		this.ring.size = 11
		const framerate = 100
		this.animation = new Animation(() => this.renderAnimationFrame(), framerate)
		this.animation.start()
		this.showControls = true
	}

	public set showControls(show: boolean) {
		if (!show) {
			this.gui.destroy()
			this.gui = null
			return
		}

		if (!this.gui) {
			this.gui = new GUI({ container: this.el })
			this.gui.domElement.style.position = 'absolute'
			this.gui.domElement.style.right = '0'
			this.gui.domElement.style.top = '0'
		}

		this.gui = new GUI(this.el)
		this.gui.add({ dpi: this.canvas.dpi }, 'dpi', 0.1, 2, 0.1).onChange((value: number) => {
			this.canvas.dpi = value
			this.canvas.resize()
		})
		this.gui.add({ blur: this.settings.blur }, 'blur', 0, 10, 1).onChange((value: number) => {
			this.settings.blur = value
			this.canvas.render()
		})
		this.gui.add({ ringSize: this.settings.ringSize }, 'ringSize', 1, 25, 1).onChange((value: number) => {
			this.settings.ringSize = value
			this.ring.size = value
			this.canvas.render()
		})
		this.gui.add({ ringCount: this.settings.ringCount }, 'ringCount', 1, 9, 1).onChange((value: number) => {
			this.settings.ringCount = value
			this.ring.numLevels = value
			this.canvas.render()
		})
	}

	private blurCanvas = (value: number) => {
		this.canvas.ctx.filter = value > 0 ? `blur(${value}px)` : 'none'
	}

	private fillRings = () => {
		this.ring.pixels.forEach(({ color, center }, index) => {
			const { bounds } = this.canvas
			const x = bounds.center.x + center.x
			const y = bounds.center.y + center.y

			this.canvas.ctx.fillStyle = color.toString()
			this.canvas.ctx.beginPath()
			this.canvas.ctx.moveTo(x, y)
			this.canvas.ctx.arc(x, y, this.ring.size, 0, r360)
			this.canvas.ctx.fill()
		})
	}

	private renderAnimationFrame() {
		this.canvas.layers = [
			() => this.blurCanvas(this.settings.blur),
			this.fillRings,
			() => this.blurCanvas(1),
			this.fillRings,
		]
		this.canvas.render()
	}
}

export default App
