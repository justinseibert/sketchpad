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
		levels: 1,
		spread: 1,
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
			.add({ levels: options.cluster.levels }, 'levels', 1, 10, 1)
			.onChange((value: number) => (this.metaball.levels = value))
		this.gui
			.add({ spread: options.cluster.spread }, 'spread', 1, 10, 1)
			.onChange((value: number) => (this.metaball.spread = value))
		this.gui
			.add({ showDetached: options.cluster.minCluster < 1 }, 'showDetached')
			.onChange((value: boolean) => (this.metaball.minCluster = value ? 0 : 1))
		this.gui
			.add({ showOriginal: options.cluster.showOriginal }, 'showOriginal')
			.onChange((value: boolean) => (this.metaball.showOriginal = value))
		this.gui.add({ randomize: () => this.metaball.init() }, 'randomize')
	}
}

export default App
