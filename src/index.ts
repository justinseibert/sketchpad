import 'src/styles/main.scss'

import Plant from 'src/models/plant'
import Animation from 'src/models/animation'

class App {
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement){
    this.el = el
  }

  init() {
    let animate = true
    const plant = new Plant(this.el, { width: 500, height: 500 })
    console.log(plant)
    const growth = new Animation(() => plant.grow(), 60)

    window.addEventListener('click', () => {
      console.log('animate', animate)
      growth.animate(animate)
      animate = !animate
    })
  }
}

export default App
