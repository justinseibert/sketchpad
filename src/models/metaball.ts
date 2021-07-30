import Canvas from 'src/models/canvas'
import Circle from 'src/models/circle'
import Arc from 'src/models/arc'

import { radian } from 'src/utils/geometry'

import { CanvasOptions } from 'src/types/canvas'

class Metaball extends Canvas {
    primary: Circle

    constructor(el: HTMLCanvasElement, options: CanvasOptions) {
        super(el, options)

        this.primary = new Circle(
            this.center.y,
            this.center.x,
            50
        )
    }

    public render(intruder: Circle) {
        this.clear()
        const r360 = radian(360)
        const threshold = 50

        this.ctx.strokeStyle = '#ddd'
        this.ctx.fillStyle = '#ddd'

        let anticlock = true
        const metaball = intruder.getMetaball(this.primary, threshold)
        
        if (metaball.length < 4) {
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
            
            return
        }
        
        metaball.forEach((arc:Arc) => {
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.arc(
                arc.center.x,
                arc.center.y,
                arc.radius,
                arc.startAngle,
                arc.endAngle,
                anticlock,
            )
            this.ctx.stroke()
            this.ctx.restore()
            anticlock = !anticlock
        })
    }
}

export default Metaball