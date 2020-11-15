import '@/styles/main.scss'

// import Animation from '@/animations/frosty'
// import Animation from '@/animations/all-roads'
import Animation from '@/animations/spirogaffe'

import { CanvasType, BoxType, PointType } from '@/types'

class App {
  canvas: CanvasType
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement){
    this.el = el
    this.canvas = {
      dpi: 2,
      margin: 100,
      background: { h: 30, s: 7, l: 17 },
    } as CanvasType
  }

  getDimensions() {
    const box:BoxType = {
      w: window.innerWidth,
      h: window.innerHeight,
    }
    const center:PointType = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    this.canvas = {
      ...this.canvas,
      box,
      center,
    }
  }

  initializeCanvas() {
    const { box: { w, h }, dpi } = this.canvas
    this.canvas.ctx = this.el.getContext('2d')

    this.el.width = w * dpi
    this.el.height = h * dpi
    this.el.style.width = `${w}px`
    this.el.style.height = `${h}px`

    this.canvas.ctx.scale(dpi,dpi)
    this.canvas.ctx.save()
  }

  init() {
    this.getDimensions()
    this.initializeCanvas()
    const animation = new Animation(this.canvas)
    animation.render()
  }
}

export default App
