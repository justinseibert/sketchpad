import CRGB from '../models/crgb'
import RingInstance from '../models/ring'

class Pattern {
	leds: CRGB[] = []
	numEyes: number = 1

	currentFrame: number = 0
	frameInterval: number = 10
	isRenderFrame: boolean = false

	get ringCounts() {
		return RingInstance.ringIndices
	}

	get numLedsAll() {
		return this.leds.length * this.numEyes
	}

	constructor(leds: CRGB[], numEyes: number) {
		this.leds = leds
		this.numEyes = numEyes
	}

	update() {
		if (Date.now() - this.currentFrame < this.frameInterval) {
			this.isRenderFrame = false
			return
		}
		this.isRenderFrame = true
		this.currentFrame = Date.now()
	}

	clear() {
		for (let i = 0; i < this.leds.length; i++) {
			this.leds[i] = CRGB.Black
		}
	}

	fill(color: CRGB) {
		for (let i = 0; i < this.leds.length; i++) {
			this.leds[i] = color
		}
	}
}

export default Pattern
