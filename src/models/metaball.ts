import Canvas from 'src/models/canvas'
import Circle from 'src/models/circle'
import Point from 'src/models/point'

import { radian } from 'src/utils/geometry'

import { CanvasOptions } from 'src/types/canvas'

class Metaball extends Canvas {
    primary: Circle

    constructor(el: HTMLCanvasElement, options: CanvasOptions) {
        super(el, options)

        this.primary = new Circle(
            this.center.y,
            this.center.x,
            100
        )
    }

    public render(intruder: Circle) {
        this.clear()
        const r360 = radian(360)

        // circle bounds
        this.ctx.strokeStyle = '#ddd'
        this.ctx.fillStyle = '#ddd'
        this.ctx.beginPath()
        this.ctx.arc(
            this.primary.center.x,
            this.primary.center.y,
            this.primary.radius,
            0,
            r360
        )
        this.ctx.stroke()
        
        this.ctx.beginPath()
        this.ctx.arc(
            intruder.center.x,
            intruder.center.y,
            intruder.radius,
            0,
            r360
        )
        this.ctx.stroke()

        // helper visuals
        this.ctx.strokeStyle = '#666'
        this.ctx.fillStyle = '#666'
        
        // boundaries
        this.ctx.beginPath()
        this.ctx.arc(
            this.primary.center.x,
            this.primary.center.y,
            this.primary.boundary,
            0,
            r360
        )
        this.ctx.stroke()
        
        this.ctx.beginPath()
        this.ctx.arc(
            intruder.center.x,
            intruder.center.y,
            intruder.boundary,
            0,
            r360
        )
        this.ctx.stroke()
                
        // circle boundary intersections
        this.primary.intersectionsWith(intruder).forEach((point: Point) => {
            this.ctx.beginPath()
            this.ctx.arc(
                point.x,
                point.y,
                this.primary.threshold,
                0,
                r360
            )
            this.ctx.fill()
        })

        // circle 

        // circle centers
        this.ctx.beginPath()
        this.ctx.arc(
            this.primary.center.x,
            this.primary.center.y,
            2,
            0,
            r360
        )
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.arc(
            intruder.center.x,
            intruder.center.y,
            2,
            0,
            r360
        )
        this.ctx.fill()
    }
}

export default Metaball