import { CanvasType, ColorType, PointType } from '@/types'

class Stroke {
  color: ColorType
  points: PointType[]

  constructor(canvas: CanvasType) {
    this.color = { ...canvas.background }
    this.points = [
      { ...canvas.center }
    ]
  }

  setLightness(value:number=100) {
    this.color = {
      ...this.color,
      l: value
    }
  }

  getHSL() {
    return `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`
  }
}

export default Stroke
