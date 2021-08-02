import 'src/styles/main.scss'

import Metaball from 'src/models/metaball'
import Circle from 'src/models/circle'

class App {
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement){
    this.el = el
  }

  init() {
    const metaball = new Metaball(this.el, { width: 500, height: 500 })
    metaball.render()
  }
}

export default App
