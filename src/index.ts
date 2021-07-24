import 'src/styles/main.scss'

import Canvas from 'src/models/canvas'

class App {
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement){
    this.el = el
  }

  init() {
    const canvas = new Canvas(this.el, {})
  }
}

export default App
