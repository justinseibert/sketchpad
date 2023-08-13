import Point from './point'
import CRGB from './crgb'

import { r360, r90 } from 'src/utils/geometry'
import { accumulateArray } from 'src/utils/math'

export interface Pixel {
	color: CRGB
	center: Point
}

export class Ring {
	static instance: Ring
	static allLedCounts = [
		1, // 181
		8, // 180
		12, // 172
		16, // 160
		24, // 144
		32, // 120
		40, // 88
		48, // 48
	]

	private _size: number = 10
	get size() {
		return this._size
	}
	set size(size: number) {
		this._size = size
		this.init()
	}

	private _ledCounts: number[] = []
	get ledCounts() {
		return this._ledCounts
	}

	private _ringIndices: number[] = []
	get ringIndices() {
		return this._ringIndices
	}

	get numRings() {
		return this.ledCounts.length
	}
	set numRings(numRings: number) {
		this._ledCounts = Ring.allLedCounts.slice(0, numRings)
		// reverse and accumulate ledCounts for
		this._ringIndices = accumulateArray([...this._ledCounts].reverse()).reverse()
		this._ringIndices.push(0)
		console.log(this._ringIndices)
		this.init()
	}

	public get outerRadius() {
		return this.numRings * (this.size * 3)
	}

	public pixels: Pixel[] = []

	constructor() {
		if (!Ring.instance) {
			Ring.instance = this
			Ring.instance.numRings = Ring.allLedCounts.length
		}

		return Ring.instance
	}

	init() {
		const pixels: Pixel[] = []

		this.ledCounts.forEach((numLeds, i) => {
			const outerRadius = i * (this.size * 3)

			// given the outerRadius of the current ring, distribute numLeds evenly around the circumference
			for (let ledIndex = 0; ledIndex < numLeds; ledIndex++) {
				const angle = ((ledIndex + 1) / numLeds) * r360 + r90
				const x = outerRadius * Math.cos(angle)
				const y = outerRadius * Math.sin(angle)
				pixels.push({
					color: CRGB.Black,
					center: new Point(x, y),
				})
			}
		})

		this.pixels = pixels
		this.pixels.reverse()
	}
}

const RingInstance = new Ring()
export default RingInstance
