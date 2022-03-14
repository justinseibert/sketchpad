import Canvas from 'src/models/canvas'
import Point from 'src/models/point'

import { radian } from 'src/utils/geometry'

import { CanvasOptions } from 'src/types/canvas'
import { SunOptions } from 'src/types/sun'

class Sun extends Canvas {
	position: Point
	margin: number
	radius: number
	opacity: number

	private _power: number
	private _rad360: number

	constructor(container: HTMLDivElement, canvasOptions: CanvasOptions, sunOptions: SunOptions) {
		super(container, canvasOptions)

		this.power = sunOptions.power || 0.85
		this.position = new Point()
		this._rad360 = radian(360)
	}

	public get power() {
		return this._power
	}

	public set power(value: number) {
		this._power = value

		this.radius = 15 * value + 10
		this.margin = 10 * value
		this.opacity = value + 0.25
	}

	public render() {
		const { x, y } = this.position
		this.ctx.fillStyle = `rgba(220,220,220,${this.opacity})`

		this.ctx.clearRect(0, 0, this.width, this.height)
		this.ctx.beginPath()
		this.ctx.arc(x, y, this.radius, 0, this._rad360)
		this.ctx.fill()
	}
}

export default Sun
