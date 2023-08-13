import 'src/styles/main.scss'

import GUI from 'lil-gui'

import Canvas from './models/canvas'
import Animation from './models/animation'
import CRGB from './models/crgb'

import RingInstance from './models/ring'
import StarPattern from './patterns/starPattern'

import { r360 } from './utils/geometry'

class App {
	el: HTMLDivElement
	canvas: Canvas
	animation: Animation
	gui: GUI

	pattern: StarPattern

	settings = {
		dpi: 0.1,
		blur: 1,
		ringSize: 12,
		ringCount: 8,
		isBacked: true,
		isLabeled: false,
	}

	constructor(el: HTMLDivElement) {
		this.el = el
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
			if (this.settings.isBacked) {
				this.canvas.ctx.fillStyle = CRGB.Black.toString()
				this.canvas.ctx.beginPath()
				this.canvas.ctx.moveTo(x, y)
				this.canvas.ctx.arc(x, y, RingInstance.outerRadius, 0, r360)
				this.canvas.ctx.fill()
			}
		}

		window.addEventListener('resize', () => {
			this.canvas.resize()
		})
		window.addEventListener('mouseup', () => {
			// start or stop animation
			// this.animation.toggle()
			// this.renderAnimationFrame()
		})

		const testColors = [
			new CRGB(0, 100, 255).lerp8(CRGB.Black, 200),
			new CRGB(80, 255, 0),
			new CRGB(255, 0, 0),
			new CRGB(0, 80, 255),
		]
		const ringColor = testColors[1]
		const decayColor = testColors[3]
		const decayRate = 2
		const sharpness = 2.1
		const segmentCount = 12
		this.pattern = new StarPattern(ringColor, 1, 5, new Array(500).fill(CRGB.Black), 1)
		this.pattern.decayColor = decayColor
		this.pattern.decayRate = decayRate
		this.pattern.sharpness = sharpness
		this.pattern.segmentCount = segmentCount
		const framerate = 1000
		this.animation = new Animation(() => this.renderAnimationFrame(), framerate)
		this.animation.start()
		this.toggleControls(true)
		this.fillRings()
	}

	public toggleControls(show: boolean) {
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

		const displayFolder = this.gui.addFolder('Display')
		const ringFolder = this.gui.addFolder('Ring')

		displayFolder.add({ dpi: this.canvas.dpi }, 'dpi', 0.1, 2, 0.1).onChange((value: number) => {
			this.canvas.dpi = value
			this.canvas.resize()
		})
		displayFolder.add({ blur: this.settings.blur }, 'blur', 0, 3, 1).onChange((value: number) => {
			this.settings.blur = value
			this.canvas.render()
		})
		displayFolder.add({ isBacked: this.settings.isBacked }, 'isBacked').onChange((value: boolean) => {
			this.settings.isBacked = value
			this.canvas.render()
		})
		displayFolder.add({ isLabeled: this.settings.isLabeled }, 'isLabeled').onChange((value: boolean) => {
			this.settings.isLabeled = value
			this.canvas.render()
		})

		ringFolder.add({ ringSize: this.settings.ringSize }, 'ringSize', 1, 25, 1).onChange((value: number) => {
			this.settings.ringSize = value
			RingInstance.size = value
			this.canvas.render()
		})
		ringFolder.add({ ringCount: this.settings.ringCount }, 'ringCount', 1, 8, 1).onChange((value: number) => {
			this.settings.ringCount = value
			RingInstance.numRings = value
			this.canvas.render()
		})
	}

	private blurCanvas = (value: number) => {
		this.canvas.ctx.filter = value > 0 ? `blur(${value}px)` : 'none'
	}

	private fillRings = () => {
		RingInstance.pixels.forEach(({ color, center }, index) => {
			const { bounds } = this.canvas
			const x = bounds.center.x + center.x
			const y = bounds.center.y + center.y

			this.canvas.ctx.fillStyle = this.pattern.leds[index]?.toString() || color.toString()
			this.canvas.ctx.beginPath()
			this.canvas.ctx.moveTo(x, y)
			this.canvas.ctx.arc(x, y, RingInstance.size, 0, r360)
			this.canvas.ctx.fill()

			if (this.settings.isLabeled) {
				this.canvas.ctx.fillStyle = CRGB.White.toString()
				this.canvas.ctx.font = '10px sans-serif'
				this.canvas.ctx.textAlign = 'center'
				this.canvas.ctx.textBaseline = 'middle'
				this.canvas.ctx.fillText(index.toString(), x, y)
			}
		})
	}

	private renderAnimationFrame() {
		this.pattern.update()
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
