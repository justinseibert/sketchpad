import Canvas from 'src/models/canvas'
import Point from 'src/models/point'

import { SunOptions } from 'src/types/sun'

class Sun {
    canvas: Canvas
    position: Point
    radius: number

    constructor(canvas: Canvas, options: SunOptions) {
        this.canvas = canvas
        this.radius = options.radius || 20
        this.position = new Point()
    }
}

export default Sun