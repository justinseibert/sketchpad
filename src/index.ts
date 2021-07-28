import 'src/styles/main.scss'

import Canvas from 'src/models/canvas'
import Plant from 'src/models/plant'
import Sun from 'src/models/sun'
import Animation from 'src/models/animation'

class App {
  el: HTMLDivElement
  constructor(el: HTMLDivElement){
    this.el = el
  }

  init() {
    let isAnimated = true
    const canvasOptions = {
      width: 500,
      height: 500
    }
    const sun = new Sun(this.el, canvasOptions, {})
    const plant = new Plant(this.el, canvasOptions)
    const growth = new Animation(() => plant.grow(sun), 30)

    this.el.addEventListener('mousemove', (event: MouseEvent) => {
      sun.position.x = event.offsetX
      sun.position.y = event.offsetY
      sun.render()
    })
    
    this.el.addEventListener('click', (event: MouseEvent) => {
      sun.position.x = event.offsetX
      sun.position.y = event.offsetY
      sun.opacity = isAnimated ? 1 : 0.25
      sun.render()

      growth.animate(isAnimated)
      isAnimated = !isAnimated
    })
  }
}

export default App
