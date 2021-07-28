import Canvas from 'src/models/canvas'
import Point from 'src/models/point'

import { radian } from 'src/utils/geometry'

import { CanvasOptions } from 'src/types/canvas'
import { SunOptions } from 'src/types/sun'

class Sun extends Canvas {
    position: Point
    margin: number
    radius: number
    rad360: number
    opacity: number

    constructor(container: HTMLDivElement, canvasOptions: CanvasOptions, sunOptions: SunOptions) {
        super(container, canvasOptions)

        this.radius = sunOptions.radius || 20
        this.margin = sunOptions.margin || 10
        this.opacity = 0.25
        this.position = new Point()
        this.rad360 = radian(360)

        this.container.style.cursor = 'none'
    }

    public render() {
        const { x, y } = this.position
        this.ctx.fillStyle = `rgba(220,220,220,${this.opacity})`
        
        this.ctx.clearRect(0,0,this.width,this.height)
        this.ctx.beginPath()
        this.ctx.arc(x, y, this.radius, 0, this.rad360)
        this.ctx.fill()
    }
}

export default Sun