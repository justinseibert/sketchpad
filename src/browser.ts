import GUI from 'lil-gui'
import { debounce } from 'lodash'

import Plant from 'src/models/plant'
import Sun from 'src/models/sun'
import Animation from 'src/models/animation'

import { PlantOptions } from './types/plant'
import { SunOptions } from './types/sun'
import { CanvasOptions } from './types/canvas'

interface InitOptions {
	canvas?: CanvasOptions
	plant?: PlantOptions
	sun?: SunOptions
	showControls?: boolean
	enableResize?: boolean
}

const defaultOptions = {
	canvas: {},
	plant: {
		branches: 2,
	},
	sun: {
		power: 0.85,
	},
	showControls: true,
	enableResize: true,
}

class App {
	el: HTMLDivElement
	gui: GUI

	sun: Sun
	plant: Plant
	growth: Animation

	constructor(el: HTMLDivElement, options: InitOptions = defaultOptions) {
		this.el = el

		options = {
			...defaultOptions,
			...(options || {}),
		}

		let isAnimated = true
		const canvasOptions = {
			...(options.canvas || {}),
		}
		this.sun = new Sun(this.el, { ...canvasOptions }, {})
		this.sun.el.className = 'sun'
		this.plant = new Plant(this.el, { ...canvasOptions, zIndex: 1 }, {})
		this.plant.el.className = 'plant'
		this.growth = new Animation(() => this.plant.grow(this.sun), 30)

		this.plant.el.addEventListener('mousemove', (event: MouseEvent) => {
			this.sun.position.x = event.offsetX
			this.sun.position.y = event.offsetY
			this.sun.render()
		})

		this.plant.el.addEventListener('click', (event: MouseEvent) => {
			this.sun.position.x = event.offsetX
			this.sun.position.y = event.offsetY
			this.sun.opacity = isAnimated ? 1 : 0.25
			this.sun.render()

			this.growth.animate(isAnimated)
			isAnimated = !isAnimated
		})

		if (options.enableResize) {
			window.addEventListener(
				'resize',
				debounce(() => {
					this.sun.resize(canvasOptions)
					this.plant.resize(canvasOptions)
				}, 300)
			)
		}

		this.plant.maxBranching = options.plant.branches
		this.sun.power = options.sun.power

		this.showControls = options.showControls
	}

	public set showControls(value: boolean) {
		if (!value) {
			this.gui = null
			return
		}

		if (!this.gui) {
			this.gui = new GUI({ container: this.el })
			this.gui.domElement.style.position = 'absolute'
			this.gui.domElement.style.right = '0'
			this.gui.domElement.style.top = '0'
		}

		this.gui
			.add({ branches: this.plant.maxBranching || 2 }, 'branches', 1, 16, 1)
			.onChange((maxBranching: number) => (this.plant.maxBranching = maxBranching))
		this.gui
			.add({ solarPower: this.sun.power * 100 }, 'solarPower', 1, 100, 5)
			.onChange((solarPower: number) => (this.sun.power = solarPower / 100))
		this.gui.add({ reset: () => this.reset() }, 'reset')
	}

	reset() {
		this.plant.init()
		this.plant.ctx.clearRect(0, 0, this.plant.width, this.plant.height)
	}
}

export default App
