class Color {
	h: number
	s: number
	l: number
	a: number

	constructor(args: Partial<Color>) {
		this.h = args.h || 0
		this.s = args.s || 100
		this.l = args.l || 50
		this.a = args.a || 1
	}

	toString() {
		return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`
	}
}

export default Color
