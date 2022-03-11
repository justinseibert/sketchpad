import * as crypto from 'crypto'

import Canvas from 'src/models/canvas'
import Arc from 'src/models/arc'
import Point from 'src/models/point'
import Line from 'src/models/line'

import { radian, rotatePoint } from 'src/utils/geometry'

import { IAttribute, IChunk, IOptions } from './types'

const r360 = radian(360)

class Kaleidoscope {
	attributes: IAttribute
	canvas: Canvas
	height: number
	pixels: number[]
	scale: number
	step: number
	width: number

	algorithmList: string[] = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160']

	private _size: number = 0
	private _hash: string = ''
	private _input: string = ''
	private _algorithm: string = 'sha256'

	constructor(canvas: Canvas, options: IOptions) {
		this.attributes = {
			offset: 0,
			radius: 0,
			slices: 0,
		} as IAttribute
		this.canvas = canvas
		this.input = options.input || 'hello world'
		this.pixels = []
		this.step = 4

		this.size =
			options.size || (this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width) - 50
		this.scale = Math.sqrt(this.width * 0.03)
	}

	public get size() {
		return this._size
	}
	public set size(value: number) {
		this._size = value
		if (!value) {
			value = (this.canvas.width > this.canvas.height ? this.canvas.height : this.canvas.width) - 50
		}
		this.width = value
		this.height = value
		this.render()
	}

	public get input() {
		return this._input
	}
	public set input(value: string) {
		this._input = value
		this._hash = this.generateHash()
		this.render()
	}

	public get algorithm() {
		return this._algorithm
	}
	public set algorithm(value: string) {
		this._algorithm = value
		this._hash = this.generateHash()
		this.render()
	}

	public get hash() {
		return this._hash
	}
	private generateHash() {
		return crypto.createHash(this.algorithm).update(this.input).digest('hex')
	}

	public render() {
		// this.markBounds()
		this.canvas.ctx.save()
		this.canvas.clear()
		this.pixels = []
		this.generatePattern()
		this.draw()
		this.canvas.ctx.restore()
	}

	private slicedBoundary(): number {
		return radian(360 / this.attributes.slices)
	}

	private getChunks(index: number): IChunk {
		const safe = (i: number) => {
			return i % this.hash.length
		}
		return {
			radius: this.hash.substring(index, index + this.step),
			offset: this.hash[safe(index + 1)],
			slice: this.hash[safe(index + 2)],
		}
	}

	private markBounds() {
		const {
			ctx,
			center: { x, y },
		} = this.canvas
		const dash = 5

		ctx.strokeStyle = '#f00'
		// crosshair x
		ctx.beginPath()
		ctx.moveTo(x - dash, y)
		ctx.lineTo(x + dash, y)
		ctx.stroke()

		// crosshair y
		ctx.beginPath()
		ctx.moveTo(x, y - dash)
		ctx.lineTo(x, y + dash)
		ctx.stroke()

		// pattern
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + this.width / 2, y)
		ctx.stroke()

		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + this.width / 2, y + this.height / 2)
		ctx.stroke()

		// boundary
		ctx.beginPath()
		ctx.rect(x - this.width / 2, y - this.height / 2, this.width, this.height)
		ctx.stroke()
	}

	private generatePattern() {
		for (let index = 0; index < this.hash.length; index += this.step) {
			const chunk = this.getChunks(index)

			this.attributes.radius = this.getScale(chunk.radius)
			this.attributes.offset = this.getScale(chunk.offset)
			if (index % this.step === 0) {
				this.attributes.slices = this.toDecimal(chunk.slice) * 2 + 4
			}

			const origin = new Point(this.canvas.center.x + this.attributes.offset, this.canvas.center.y)
			const arc = new Arc(origin, this.attributes.radius)

			const increment = radian(this.scale)
			const maximum = radian(180)
			const frameBoundary = this.canvas.center.x + this.width / 2
			let angle = 0

			while (angle < maximum) {
				const point = arc.stroke(angle)
				const testAngle = new Line(this.canvas.center, point).angle
				angle += increment
				if (point.x > frameBoundary || testAngle > this.slicedBoundary()) {
					continue
				}
				this.addPixel(point)
				this.generateReflections(point, testAngle)
			}
		}
	}

	private generateReflections(point: Point, angle: number) {
		for (let index = 1; index < this.attributes.slices; index++) {
			let rotation = (this.slicedBoundary() * index - angle) * 2
			const reflection = rotatePoint(this.canvas.center, point, rotation)
			this.addPixel(reflection)
			point = reflection
			angle += rotation
		}
	}

	private draw() {
		const { ctx } = this.canvas

		ctx.fillStyle = `rgba(200,200,200,.75)`
		this.pixels.forEach((pixel) => {
			const { x, y } = this.getPoint(pixel)
			ctx.beginPath()
			ctx.arc(x, y, 1, 0, r360)
			ctx.fill()
		})
	}

	private getPixel({ x, y }: Point) {
		return (x << 16) | y
	}

	private getPoint(pixel: number) {
		return new Point(pixel >> 16, pixel & 0xffff)
	}

	private addPixel(point: Point) {
		this.pixels.push(this.getPixel(point))
	}

	getScale(hex: string) {
		const ratio = this.toDecimal(hex) / this.toDecimal('f'.repeat(hex.length))
		return (this.width / 2) * ratio
	}

	toDecimal(hex: string) {
		return Number.parseInt(hex, 16)
	}
}

export default Kaleidoscope
