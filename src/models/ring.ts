import Point from './point'
import CRGB from './crgb'

import { r360 } from 'src/utils/geometry'

interface Pixel {
	color: CRGB
	center: Point
}

class Ring {
	static allLevels = [1, 8, 12, 16, 24, 32, 40, 48, 60]

	private _padding: number = 5
	get padding() {
		return this._padding
	}

	private _size: number = 25
	get size() {
		return this._size
	}
	set size(size: number) {
		this._size = size
		this._padding = size
		this.init()
	}

	private _levels: number[] = []
	get levels() {
		return this._levels
	}

	private _numLevels = Ring.allLevels.length
	get numLevels() {
		return this._numLevels
	}
	set numLevels(numLevels: number) {
		this._numLevels = numLevels
		this._levels = Ring.allLevels.slice(0, numLevels)
		this.init()
	}

	public get outerRadius() {
		return this.numLevels * (this.size + this.padding * 2)
	}

	public pixels: Pixel[] = []

	constructor(numLevels: number = Ring.allLevels.length) {
		this.numLevels = numLevels
	}

	init() {
		const pixels: Pixel[] = []
		this.levels.forEach((numLeds: number, index: number) => {
			const outerRadius = index * (this.size + this.padding * 2)

			// given the outerRadius of the current ring, distribute numLeds evenly around the circumference
			for (let i = 0; i < numLeds; i++) {
				const angle = (i / numLeds) * r360
				const x = outerRadius * Math.cos(angle)
				const y = outerRadius * Math.sin(angle)
				pixels.push({
					color: CRGB.White,
					center: new Point(x, y),
				})
			}

			this.pixels = pixels
		})
	}
}

export default Ring
