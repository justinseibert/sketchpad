import Stroke from './stroke'

interface ILayer {
  strokes: Stroke[]
}

class Layer {
  strokes: Stroke[]

  constructor(args:Partial<ILayer>) {
    this.strokes = args.strokes || [] as Stroke[]
  }
}

export default Layer
