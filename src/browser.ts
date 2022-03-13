import GUI from 'lil-gui'

import Metaball from 'src/models/metaball'
import Circle from 'src/models/circle'

import { CanvasOptions } from './types/canvas'
import debounce from 'lodash.debounce'

interface InitOptions {
	canvas?: CanvasOptions
	primaryRadius?: number
	intruderRadius?: number
	gravity?: number
	showOriginal?: boolean
	showGravity?: boolean
	showDistance?: boolean
	enableResize?: boolean
	showControls?: boolean
}

const defaultOptions = {
	canvas: {},
	primaryRadius: 50,
	intruderRadius: 50,
	gravity: 50,
	showOriginal: false,
	showGravity: false,
	showDistance: true,
	enableResize: true,
	showControls: true,
}

class App {
	el: HTMLDivElement
	gui: GUI | null

	intruder: Circle
	metaball: Metaball

	constructor(el: HTMLDivElement, options: InitOptions = defaultOptions) {
		this.el = el
		this.el.style.position = 'relative'

		options = {
			...defaultOptions,
			...(options || {}),
		}

		this.metaball = new Metaball(this.el, options.canvas, options.primaryRadius)
		this.intruder = new Circle(-40, -40, options.intruderRadius)
		this.metaball.render(this.intruder)

		this.metaball.el.style.cursor = 'none'

		this.metaball.el.addEventListener('mousemove', (event: MouseEvent) => {
			this.intruder.center.x = event.offsetX
			this.intruder.center.y = event.offsetY
			this.metaball.render(this.intruder)
		})

		if (options.enableResize) {
			window.addEventListener(
				'resize',
				debounce(() => {
					this.metaball.resize(options.canvas)
					this.metaball.render(this.intruder)
				}, 300)
			)
		}

		this.metaball.primary.radius = options.primaryRadius
		this.intruder.radius = options.intruderRadius
		this.metaball.threshold = options.gravity
		this.metaball.showDistance = options.showDistance
		this.metaball.showGravity = options.showGravity
		this.metaball.showOriginal = options.showOriginal

		this.showControls = options.showControls
	}

	public set showControls(value: boolean) {
		if (!value) {
			this.gui = null
			return
		}

		if (!this.gui) {
			this.gui = new GUI({ container: this.metaball.parent })
			this.gui.domElement.style.position = 'absolute'
			this.gui.domElement.style.right = '0'
			this.gui.domElement.style.top = '0'
		}
		this.gui
			.add({ primaryRadius: this.metaball.primary.radius }, 'primaryRadius', 5, 100, 5)
			.onChange((value: number) => (this.metaball.primary.radius = value))
		this.gui
			.add({ intruderRadius: this.intruder.radius }, 'intruderRadius', 5, 100, 5)
			.onChange((value: number) => (this.intruder.radius = value))
		this.gui
			.add({ gravity: this.metaball.threshold }, 'gravity', 0, 100, 5)
			.onChange((value: number) => (this.metaball.threshold = value))
		this.gui
			.add({ showOriginal: this.metaball.showOriginal }, 'showOriginal')
			.onChange((value: boolean) => (this.metaball.showOriginal = value))
		this.gui
			.add({ showGravity: this.metaball.showGravity }, 'showGravity')
			.onChange((value: boolean) => (this.metaball.showGravity = value))
		this.gui
			.add({ showDistance: this.metaball.showDistance }, 'showDistance')
			.onChange((value: boolean) => (this.metaball.showDistance = value))
	}
}

export default App
