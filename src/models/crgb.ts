class CRGB {
	r: number
	g: number
	b: number

	constructor(r: number, g: number, b: number) {
		this.r = r
		this.g = g
		this.b = b
	}

	lerp(dest: CRGB, amount: number): CRGB {
		const r = this.r + (dest.r - this.r) * amount
		const g = this.g + (dest.g - this.g) * amount
		const b = this.b + (dest.b - this.b) * amount
		return new CRGB(r, g, b)
	}

	lerp8(dest: CRGB, amount: number): CRGB {
		// clamp amount to 0-255, then normalize to 0-1
		amount = Math.min(Math.max(amount, 0), 255) / 255
		return this.lerp(dest, amount)
	}

	toString(): string {
		return `rgb(${this.r}, ${this.g}, ${this.b})`
	}

	static fromHex(hex: string): CRGB {
		const r = parseInt(hex.substring(1, 3), 16)
		const g = parseInt(hex.substring(3, 5), 16)
		const b = parseInt(hex.substring(5, 7), 16)
		return new CRGB(r, g, b)
	}

	static fromHSL(h: number, s: number, l: number): CRGB {
		const c = (1 - Math.abs(2 * l - 1)) * s
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
		const m = l - c / 2
		let r = 0
		let g = 0
		let b = 0
		if (h >= 0 && h < 60) {
			r = c
			g = x
			b = 0
		} else if (h >= 60 && h < 120) {
			r = x
			g = c
			b = 0
		} else if (h >= 120 && h < 180) {
			r = 0
			g = c
			b = x
		} else if (h >= 180 && h < 240) {
			r = 0
			g = x
			b = c
		} else if (h >= 240 && h < 300) {
			r = x
			g = 0
			b = c
		} else if (h >= 300 && h < 360) {
			r = c
			g = 0
			b = x
		}
		r = Math.round((r + m) * 255)
		g = Math.round((g + m) * 255)
		b = Math.round((b + m) * 255)
		return new CRGB(r, g, b)
	}

	static fromHSV(h: number, s: number, v: number): CRGB {
		const c = v * s
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
		const m = v - c
		let r = 0
		let g = 0
		let b = 0
		if (h >= 0 && h < 60) {
			r = c
			g = x
			b = 0
		} else if (h >= 60 && h < 120) {
			r = x
			g = c
			b = 0
		} else if (h >= 120 && h < 180) {
			r = 0
			g = c
			b = x
		} else if (h >= 180 && h < 240) {
			r = 0
			g = x
			b = c
		} else if (h >= 240 && h < 300) {
			r = x
			g = 0
			b = c
		} else if (h >= 300 && h < 360) {
			r = c
			g = 0
			b = x
		}
		r = Math.round((r + m) * 255)
		g = Math.round((g + m) * 255)
		b = Math.round((b + m) * 255)
		return new CRGB(r, g, b)
	}

	static get Black(): CRGB {
		return new CRGB(0, 0, 0)
	}

	static get White(): CRGB {
		return new CRGB(255, 255, 255)
	}
}

export default CRGB
