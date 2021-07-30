import Canvas from 'src/models/canvas'
import Circle from 'src/models/circle'
import Arc from 'src/models/arc'
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
            60
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
        
        if (metaball.arcs.length < 3) {
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
        
        metaball.arcs.forEach((arc:Arc, index: number) => {
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.arc(
                arc.center.x, arc.center.y,
                arc.radius,
                arc.startAngle, arc.endAngle,
                // 0, r360,
                anticlock,
            )
            this.ctx.stroke()
            this.ctx.restore()

            anticlock = !anticlock
        })
    }

    private _label(text: any, position: Point) {
        this.ctx.save()
        this.ctx.fillStyle = '#fff'
        this.ctx.fillText(text.toString(), position.x, position.y)
        this.ctx.restore()
    }
}

export default Metaball