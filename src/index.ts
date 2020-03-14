import './styles/main.scss'

class App {
  elem: HTMLElement
  constructor(el: HTMLElement){
    this.elem = el
  }

  init() {
    this.elem.innerHTML = `hey world`
  }
}

export default App
