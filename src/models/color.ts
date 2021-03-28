class Color {
  h: number
  s: number
  l: number
  a: number

  constructor(args:Partial<Color>) {
    this.h = args.h || 0
    this.s = args.s || 0
    this.l = args.l || 0
    this.a = args.a || 1
  }

  toString() {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`
  }
}

export default Color
