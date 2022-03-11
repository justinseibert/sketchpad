import 'src/styles/main.scss'

import GUI from 'lil-gui'

import Metaball, { ClusterOptions } from 'src/models/metaball'

import { CanvasOptions } from 'src/types/canvas'

interface InitOptions {
	canvas?: CanvasOptions
	cluster?: ClusterOptions
}

const defaultOptions = {
	canvas: {},
	cluster: {
		count: 8,
		size: 40,
		range: 5,
		minCluster: 0,
		showOriginal: true,
	},
}

class App {
	el: HTMLCanvasElement
	gui: GUI
	metaball: Metaball

	constructor(el: HTMLCanvasElement, options: InitOptions = defaultOptions) {
		this.el = el
		this.gui = new GUI()

		options = {
			...defaultOptions,
			...(options || {}),
		}

		this.metaball = new Metaball(this.el, options.canvas, options.cluster)
		this.metaball.render()

		this.gui
			.add({ count: options.cluster.count }, 'count', 1, 25, 1)
			.onChange((value: number) => (this.metaball.count = value))
		this.gui
			.add({ minSize: options.cluster.size }, 'minSize', 5, 80, 5)
			.onChange((value: number) => (this.metaball.size = value))
		this.gui
			.add({ sizeRange: options.cluster.range }, 'sizeRange', 0, 15, 1)
			.onChange((value: number) => (this.metaball.range = value))
		this.gui
			.add({ showAll: options.cluster.minCluster < 1 }, 'showAll')
			.onChange((value: boolean) => (this.metaball.minCluster = value ? 0 : 1))
		this.gui
			.add({ showOriginal: options.cluster.showOriginal }, 'showOriginal')
			.onChange((value: boolean) => (this.metaball.showOriginal = value))
		this.gui.add({ randomize: () => this.metaball.init() }, 'randomize')
	}
}

export default App
