import GUI from 'lil-gui'
import { debounce } from 'lodash'

import Metaball, { ClusterOptions } from 'src/models/metaball'

import { CanvasOptions } from 'src/models/canvas'

interface InitOptions {
	canvas?: CanvasOptions
	cluster?: ClusterOptions
	showControls?: boolean
	enableResize?: boolean
}

const defaultOptions = {
	canvas: { width: 500 },
	cluster: {
		count: 8,
		size: 40,
		range: 5,
		minCluster: 0,
		showOriginal: true,
		levels: 1,
		spread: 1,
	},
	showControls: true,
	enableResize: true,
}

class App {
	el: HTMLDivElement
	gui: GUI

	metaball: Metaball

	constructor(el: HTMLDivElement, options: InitOptions = defaultOptions) {
		this.el = el
		this.el.style.position = 'relative'

		options = {
			...defaultOptions,
			...(options || {}),
		}

		this.metaball = new Metaball(this.el, options.canvas, options.cluster)
		this.metaball.render()

		this.metaball.count = options.cluster.count
		this.metaball.size = options.cluster.size
		this.metaball.range = options.cluster.range
		this.metaball.levels = options.cluster.levels
		this.metaball.spread = options.cluster.spread
		this.metaball.minCluster = options.cluster.minCluster
		this.metaball.showOriginal = options.cluster.showOriginal

		this.showControls = options.showControls

		if (options.enableResize) {
			window.addEventListener(
				'resize',
				debounce(() => {
					this.metaball.resize(options.canvas)
					this.metaball.render()
				}, 300)
			)
		}
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
			.add({ count: this.metaball.count }, 'count', 1, 25, 1)
			.onChange((value: number) => (this.metaball.count = value))
		this.gui
			.add({ minSize: this.metaball.size }, 'minSize', 5, 80, 5)
			.onChange((value: number) => (this.metaball.size = value))
		this.gui
			.add({ sizeRange: this.metaball.range }, 'sizeRange', 0, 15, 1)
			.onChange((value: number) => (this.metaball.range = value))
		this.gui
			.add({ levels: this.metaball.levels }, 'levels', 1, 10, 1)
			.onChange((value: number) => (this.metaball.levels = value))
		this.gui
			.add({ spread: this.metaball.spread }, 'spread', 1, 10, 1)
			.onChange((value: number) => (this.metaball.spread = value))
		this.gui
			.add({ showDetached: this.metaball.minCluster < 1 }, 'showDetached')
			.onChange((value: boolean) => (this.metaball.minCluster = value ? 0 : 1))
		this.gui
			.add({ showOriginal: this.metaball.showOriginal }, 'showOriginal')
			.onChange((value: boolean) => (this.metaball.showOriginal = value))
		this.gui.add({ randomize: () => this.metaball.init() }, 'randomize')
	}
}

export default App
