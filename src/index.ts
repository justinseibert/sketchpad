import GUI from 'lil-gui'

import Canvas from 'src/models/canvas'
import Kaleidoscope from 'src/models/kaleidoscope'
import { IOptions, UAlgorithm } from 'src/models/kaleidoscope/types'

const defaultOptions: IOptions = {
	input: 'hello world',
	algorithm: 'sha256',
}

class App {
	el: HTMLDivElement
	gui: GUI
	canvas: Canvas
	kal: Kaleidoscope

	constructor(el: HTMLDivElement, options: IOptions = defaultOptions) {
		this.el = el
		this.el.style.position = 'relative'

		this.gui = new GUI({ container: this.el })
		this.gui.domElement.style.position = 'absolute'
		this.gui.domElement.style.right = '1em'
		this.gui.domElement.style.top = '0'

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
			.add({ algorithm: options.algorithm }, 'algorithm', this.kal.algorithmList)
			.onChange((value: UAlgorithm) => (this.kal.algorithm = value))
		this.gui.add({ size: options.size }, 'size').onChange((value: number) => (this.kal.size = value))
		this.gui.add({ text: options.input || '' }, 'text').onChange((value: string) => (this.kal.input = value))
	}
}

export default App
