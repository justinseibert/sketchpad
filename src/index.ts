import 'src/styles/main.scss'

import GUI from 'lil-gui'

import Canvas from './models/canvas'
import Animation from './models/animation'
import CRGB from './models/crgb'

import RingInstance, { Ring } from './models/ring'
import StarPattern from './patterns/starPattern'

import { r360 } from './utils/geometry'

class App {
	el: HTMLDivElement
	canvas: Canvas
	animation: Animation
	gui: GUI

	pattern: StarPattern

	private settings = {
		dpi: 0.1,
		blur: 1,
		ringSize: 12,
		ringCount: 8,
		isBacked: true,
		isLabeled: false,
		ringColor: '#b0fff1',
		decayColor: '#7f005e',
		decayRate: 17,
		sharpness: 1.3,
		spread: 1,
		hollow: 0.07,
		segmentCount: 5,
		speed: 7,
		direction: 'out',
	}

	constructor(el: HTMLDivElement) {
		this.el = el
	}

	init() {
		this.canvas = new Canvas(this.el, { allowFullscreen: true })

		this.canvas.beforeRender = () => {
			const {
				ctx,
				bounds: {
					center: { x, y },
				},
			} = this.canvas

			this.canvas.clear()
			if (this.settings.isBacked) {
				ctx.fillStyle = CRGB.Black.toString()
				ctx.beginPath()
				ctx.moveTo(x, y)
				ctx.arc(x, y, RingInstance.outerRadius, 0, r360)
				ctx.fill()
			}
		}

		window.addEventListener('resize', () => {
			this.canvas.resize()
		})

		this.pattern = new StarPattern(
			new CRGB(this.settings.ringColor),
			this.convertDirectionToNumber(this.settings.direction),
			this.settings.speed,
			new Array(500).fill(CRGB.Black), // just make sure it's more than the total number of leds
			1
		)
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

		displayFolder.add({ dpi: this.settings.dpi }, 'dpi', 0.1, 2, 0.1).onChange((value: number) => {
			this.settings.dpi = value
			this.canvas.dpi = value
			this.canvas.resize()
		})
		this.canvas.dpi = this.settings.dpi
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

		const ringsFolder = this.gui.addFolder('Rings')
		ringsFolder.add({ ringSize: this.settings.ringSize }, 'ringSize', 1, 25, 1).onChange((value: number) => {
			this.settings.ringSize = value
			RingInstance.size = value
			this.canvas.render()
		})
		RingInstance.size = this.settings.ringSize
		ringsFolder.add({ ringCount: this.settings.ringCount }, 'ringCount', 1, 8, 1).onChange((value: number) => {
			this.settings.ringCount = value
			RingInstance.numRings = value
			this.canvas.render()
		})
		RingInstance.numRings = this.settings.ringCount

		const patternFolder = this.gui.addFolder('Pattern')
		patternFolder.addColor({ ringColor: this.settings.ringColor }, 'ringColor').onChange((value: string) => {
			this.settings.ringColor = value
			this.pattern.ringColor = new CRGB(value)
			this.canvas.render()
		})
		this.pattern.ringColor = new CRGB(this.settings.ringColor)
		patternFolder.addColor({ decayColor: this.settings.decayColor }, 'decayColor').onChange((value: string) => {
			this.settings.decayColor = value
			this.pattern.decayColor = new CRGB(value)
			this.canvas.render()
		})
		this.pattern.decayColor = new CRGB(this.settings.decayColor)
		// add button to invert colors
		patternFolder.add(
			{
				invertColors: () => {
					const newColors = {
						ringColor: this.settings.decayColor,
						decayColor: this.settings.ringColor,
					}

					// update gui colors
					patternFolder.controllers.forEach((controller) => {
						switch (controller.property) {
							case 'ringColor':
								controller.setValue(newColors.ringColor)
								break
							case 'decayColor':
								controller.setValue(newColors.decayColor)
								break
						}
					})
				},
			},
			'invertColors'
		)
		patternFolder.add({ decayRate: this.settings.decayRate }, 'decayRate', 1, 255, 1).onChange((value: number) => {
			this.settings.decayRate = value
			this.pattern.decayRate = value
			this.canvas.render()
		})
		this.pattern.decayRate = this.settings.decayRate
		patternFolder.add({ sharpness: this.settings.sharpness }, 'sharpness', 0, 10, 0.1).onChange((value: number) => {
			this.settings.sharpness = value
			this.pattern.sharpness = value
			this.canvas.render()
		})
		this.pattern.sharpness = this.settings.sharpness
		patternFolder.add({ spread: this.settings.spread }, 'spread', 0, 1, 0.01).onChange((value: number) => {
			this.settings.spread = value
			this.pattern.spread = value
			this.canvas.render()
		})
		this.pattern.spread = this.settings.spread
		patternFolder.add({ hollow: this.settings.hollow }, 'hollow', 0.01, 1, 0.01).onChange((value: number) => {
			this.settings.hollow = value
			this.pattern.hollow = value
			this.canvas.render()
		})
		this.pattern.hollow = this.settings.hollow
		patternFolder
			.add({ segmentCount: this.settings.segmentCount }, 'segmentCount', 1, 60, 1)
			.onChange((value: number) => {
				this.settings.segmentCount = value
				this.pattern.segmentCount = value
				this.canvas.render()
			})
		this.pattern.segmentCount = this.settings.segmentCount
		patternFolder.add({ speed: this.settings.speed }, 'speed', 0, 10, 1).onChange((value: number) => {
			this.settings.speed = value
			this.pattern.speed = value
			this.canvas.render()
		})
		this.pattern.speed = this.settings.speed
		patternFolder
			.add({ direction: this.settings.direction }, 'direction', ['in', 'out'])
			.onChange((value: string) => {
				this.settings.direction = value
				this.pattern.direction = this.convertDirectionToNumber(value)
				this.canvas.render()
			})
		this.pattern.direction = this.convertDirectionToNumber(this.settings.direction)

		this.canvas.resize()
	}

	private convertDirectionToString = (direction: number) => {
		return direction == -1 ? 'in' : 'out'
	}

	private convertDirectionToNumber = (direction: string) => {
		return direction == 'in' ? -1 : 1
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
