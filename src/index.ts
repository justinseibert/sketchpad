import 'src/styles/main.scss'

import Canvas from 'src/models/canvas'
import Plant from 'src/models/plant'
import Sun from 'src/models/sun'
import Animation from 'src/models/animation'

class App {
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement){
    this.el = el
  }

  init() {
    let animate = true
    const canvas = new Canvas(this.el, { width: 500, height: 500 })
    const sun = new Sun(canvas, {})
    const plant = new Plant(canvas, sun)
    const growth = new Animation(() => plant.grow(), 30)

    this.el.addEventListener('mousemove', (event: MouseEvent) => {
      sun.position.x = event.offsetX
      sun.position.y = event.offsetY
    })

    this.el.addEventListener('click', (event: MouseEvent) => {
      sun.position.x = event.offsetX
      sun.position.y = event.offsetY

      growth.animate(animate)
      animate = !animate
    })
  }
}

export default App
