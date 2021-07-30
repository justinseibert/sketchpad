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
    const intruder = new Circle(-40,-40,40)
    metaball.render(intruder)

    this.el.style.cursor = 'none'

    this.el.addEventListener('mousemove', (event: MouseEvent) => {
      intruder.center.x = event.offsetX
      intruder.center.y = event.offsetY
      metaball.render(intruder)
    })
  }
}

export default App
