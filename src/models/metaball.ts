import Canvas from 'src/models/canvas'
import Circle from 'src/models/circle'
import Arc from 'src/models/arc'
import Point from 'src/models/point'

import { radian } from 'src/utils/geometry'

import { CanvasOptions } from 'src/types/canvas'

const COLOR = {
	normal: '#bbb',
	ghost: '#555',
	line: '#f33',
}

const r360 = radian(360)

class Metaball extends Canvas {
	primary: Circle
	threshold: number = 50
	showOriginal: boolean = false
	showGravity: boolean = false
	showDistance: boolean = false

	constructor(parent: HTMLDivElement, options: CanvasOptions, primaryRadius: number = 60) {
		super(parent, options)

		this.primary = new Circle(this.center.x, this.center.y, primaryRadius)
	}

	public render(intruder: Circle) {
		this.clear()

		this.ctx.strokeStyle = COLOR.normal
		this.ctx.fillStyle = COLOR.normal

		this.primary.center = this.center
		const metaball = intruder.getMetaball(this.primary, this.threshold)

		if (metaball.arcs.length < 3 || this.showOriginal) {
			this.ctx.save()
			if (this.showOriginal) {
				this.ctx.strokeStyle = COLOR.ghost
			}
			this.ctx.beginPath()
			this.ctx.arc(this.primary.center.x, this.primary.center.y, this.primary.radius, 0, r360)
			this.ctx.stroke()

			this.ctx.beginPath()
			this.ctx.arc(intruder.center.x, intruder.center.y, intruder.radius, 0, r360)
			this.ctx.stroke()
			this.ctx.restore()
		}

		if (metaball.arcs.length < 3) return

		if (this.showGravity) {
			this.drawArcs(metaball.arcs, 'ghost')
		}
		this.drawArcs(metaball.arcs, 'normal')

		if (this.showDistance) {
			this.drawDistance(this.center, intruder.center)
			this.drawDistance(this.center, metaball.arcs[0].center)
			this.drawDistance(this.center, metaball.arcs[2].center)
			this.drawDistance(intruder.center, metaball.arcs[0].center)
			this.drawDistance(intruder.center, metaball.arcs[2].center)
		}
	}

	private drawDistance(a: Point, b: Point) {
		this.ctx.save()
		this.ctx.strokeStyle = COLOR.line
		this.ctx.beginPath()
		this.ctx.moveTo(a.x, a.y)
		this.ctx.lineTo(b.x, b.y)
		this.ctx.stroke()
		this.ctx.restore()

		this._label(Math.round(a.distanceFrom(b)), a.midPointFrom(b))
	}

	private drawArcs = (arcs: Arc[], mode: 'normal' | 'ghost') => {
		let anticlock = true

		arcs.forEach((arc: Arc, index: number) => {
			let start = arc.startAngle
			let end = arc.endAngle

			if (mode === 'ghost') {
				if (index === 1 || index === 3 || index === 4) {
					return
				}
				start = 0
				end = r360
			}

			this.ctx.save()
			this.ctx.beginPath()

			this.ctx.beginPath()
			this.ctx.strokeStyle = COLOR[mode]
			this.ctx.arc(arc.center.x, arc.center.y, arc.radius, start, end, anticlock)

			this.ctx.stroke()
			this.ctx.restore()

			anticlock = !anticlock
		})
	}

	private _label(text: any, position: Point) {
		this.ctx.save()
		this.ctx.fillStyle = '#fff'
		this.ctx.fillText(text.toString(), position.x, position.y)
		this.ctx.restore()
	}
}

export default Metaball
