import 'src/styles/main.scss'

import Canvas from 'src/models/canvas'
import Plant from 'src/models/plant'
import Animation from 'src/models/animation'

class App {
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement){
    this.el = el
  }

  init() {
    let animate = true
    const canvas = new Canvas(this.el, { width: 500, height: 500 })
    const plant = new Plant(canvas)
    const growth = new Animation(() => plant.grow(), 3000)

    this.el.addEventListener('click', () => {
      growth.animate(animate)
      animate = !animate
    })
  }
}

export default App
