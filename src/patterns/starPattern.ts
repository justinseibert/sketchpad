import { random } from 'src/utils/math'

import Pattern from './pattern'
import CRGB from '../models/crgb'
import RingInstance from '../models/ring'

class StarPattern extends Pattern {
	currentIteration = 0
	ringColor: CRGB
	decayColor: CRGB
	direction: number
	speed: number
	decayRate: number
	targetSpeed: number
	segmentCount = 5
	currentRing = 0
	sharpness = 1
	spread = 1
	hollow = 0.1

	constructor(color: CRGB, direction: number, speed: number, leds: CRGB[], numEyes: number = 1) {
		super(leds, numEyes)

		this.ringColor = color
		this.direction = direction
		this.decayColor = color.lerp8(CRGB.Black, 250)
		this.targetSpeed = speed
		this.setSpeed(this.targetSpeed)
	}

	setSpeed(speed: number) {
		this.speed = speed
		this.decayRate = 60 / this.speed
	}

	restart(ring: number) {
		this.currentRing = ring
	}

	update() {
		const NUM_EYE_RINGS = RingInstance.numRings

		super.update()

		if (!this.isRenderFrame) {
			return
		}

		for (let ringIndex = 0; ringIndex < NUM_EYE_RINGS; ringIndex++) {
			const ledStart = this.ringCounts[ringIndex + 1]
			const ledEnd = this.ringCounts[ringIndex]
			const ledCount = ledEnd - ledStart
			const segmentSize = ledCount / this.segmentCount

			for (let i = 0; i < ledCount; i++) {
				const ledIndex = ledStart + i

				if (ringIndex !== this.currentRing) {
					let decayRate = this.decayRate * ((NUM_EYE_RINGS - ringIndex) * this.hollow)
					this.leds[ledIndex] = this.leds[ledIndex].lerp8(this.decayColor, decayRate)
				} else {
					const ratio = (i % segmentSize) / segmentSize
					let blend = ratio * 255

					// offset the blending so that the brightest part of the star is in the middle of the segment
					if (blend > 127) {
						blend = 255 - blend
					}

					// increase the sharpness further out from the center
					blend = blend * (1 + ringIndex * (1 - this.spread))

					// make the blending a little more dramatic
					blend = blend * this.sharpness

					this.leds[ledIndex] = this.ringColor.lerp8(this.decayColor, blend)
				}
			}
		}

		if (this.currentIteration > this.speed) {
			this.currentIteration = 0
			this.currentRing += 1 * this.direction
			if (this.currentRing >= NUM_EYE_RINGS) {
				this.restart(0)
			} else if (this.currentRing <= 0) {
				this.restart(NUM_EYE_RINGS)
			}
		}

		this.currentIteration++
	}
}

export default StarPattern
