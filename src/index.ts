import 'src/styles/main.scss'

import GUI from 'lil-gui'

import Canvas from 'src/models/canvas'
import Kaleidoscope from 'src/models/kaleidoscope'
import { IOptions } from 'src/models/kaleidoscope/types'

const defaultOptions = {
	input: 'hello world',
}

class App {
	el: HTMLCanvasElement
	gui: GUI
	canvas: Canvas
	kal: Kaleidoscope

	constructor(el: HTMLCanvasElement, options: IOptions = defaultOptions) {
		this.el = el
		this.gui = new GUI()
		this.canvas = new Canvas(this.el)
		this.canvas.init()

		options = {
			...defaultOptions,
			size: (this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width) - 50,
			...(options || {}),
		}

		this.kal = new Kaleidoscope(this.canvas, options)
		this.kal.render()

		this.gui
			.add({ algorithm: 'sha256' }, 'algorithm', this.kal.algorithmList)
			.onChange((value: string) => (this.kal.algorithm = value))
		this.gui.add({ size: options.size }, 'size').onChange((value: number) => (this.kal.size = value))
		this.gui.add({ text: options.input || '' }, 'text').onChange((value: string) => (this.kal.input = value))
	}
}

export default App
