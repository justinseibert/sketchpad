import { IntervalType, CanvasType, PointType } from '@/types'
import Stroke from '@/classes/stroke'

class Canvas {
  animate: IntervalType
  canvas: CanvasType
  ctx: CanvasRenderingContext2D
  strokes: Stroke[]
  decay: number

  constructor(canvas: CanvasType){
    this.canvas = canvas
    this.ctx = canvas.ctx
    this.strokes = [] as Stroke[]
    this.decay = 10
  }

  redraw() {
    const { box, background } = this.canvas

    this.ctx.clearRect(0,0,box.w,box.h)
    const strokes = this.strokes.reduce((result:Stroke[], item:Stroke, index: number) => {
      item.color.l -= this.decay
      if (item.color.l <= background.l) {
        return result
      }

      this.ctx.lineWidth = item.color.l / 100
      this.ctx.strokeStyle = `hsl(${background.h}, ${background.s}%, ${item.color.l}%)`
      this.ctx.beginPath()
      this.ctx.moveTo(item.points[0].x, item.points[0].y)

      const points = [ ...item.points ]
      points.shift()
      points.forEach(({ x, y }:PointType) => {
        this.ctx.lineTo(x,y)
      })
      this.ctx.stroke()

      return [
        ...result,
        item
      ]
    }, [])

    this.strokes = strokes
    console.log(this.strokes)
  }
}

export default Canvas
