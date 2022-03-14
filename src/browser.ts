import GUI from 'lil-gui'
import debounce from 'lodash.debounce'

import Canvas, { CanvasOptions } from 'src/models/canvas'
import Kaleidoscope, { AlgorithmType } from 'src/models/kaleidoscope'

export interface Options {
	canvas?: CanvasOptions
	input?: string
	size?: number
	algorithm?: AlgorithmType
	showControls?: boolean
	enableResize?: boolean
}

const defaultOptions: Options = {
	canvas: {},
	input: 'hello world',
	algorithm: 'sha256',
	showControls: true,
	enableResize: true,
}

class App {
	el: HTMLDivElement
	gui: GUI
	canvas: Canvas
	kal: Kaleidoscope

	constructor(el: HTMLDivElement, options: Options = defaultOptions) {
		this.el = el
		this.el.style.position = 'relative'

		this.canvas = new Canvas(this.el, options.canvas)

		options = {
			...defaultOptions,
			size: this.getDefaultSize(),
			...(options || {}),
		}

		this.kal = new Kaleidoscope(this.canvas, options)
		this.kal.render()

		this.kal.algorithm = options.algorithm
		this.kal.size = options.size
		this.kal.input = options.input

		this.showControls = options.showControls

		if (options.enableResize) {
			window.addEventListener(
				'resize',
				debounce(() => {
					this.canvas.resize(options.canvas)
					this.kal.render()
				}, 300)
			)
		}
	}

	public getDefaultSize() {
		return (this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width) - 50
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
			.add({ algorithm: this.kal.algorithm }, 'algorithm', this.kal.algorithmList)
			.onChange((value: AlgorithmType) => (this.kal.algorithm = value))
		this.gui.add({ size: this.kal.size }, 'size').onChange((value: number) => (this.kal.size = value))
		this.gui.add({ text: this.kal.input || '' }, 'text').onChange((value: string) => (this.kal.input = value))
	}
}

export default App
