import 'src/styles/main.scss'

import Animation from 'src/models/animation'
import Canvas from 'src/models/canvas'
import Kaleidoscope from 'src/models/kaleidoscope'

class App {
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement) {
    this.el = el
  }

  init() {
    const canvas = new Canvas(this.el)
    canvas.init()
    const k = new Kaleidoscope(canvas)
    k.render()
  }
}

export default App
