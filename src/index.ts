import '@/styles/main.scss'

// import Animation from '@/animations/frosty'
// import Animation from '@/animations/all-roads'
// import Animation from '@/animations/spirogaffe'
import Animation from '@/animations/skywriter'
// import Animation from '@/animations/font.test'

import { CanvasType, BoxType, PointType } from '@/types'

class App {
  el: HTMLCanvasElement
  constructor(el: HTMLCanvasElement){
    this.el = el
  }

  init() {
    const animation = new Animation(this.el)
    animation.init()
    animation.render()
  }
}

export default App
