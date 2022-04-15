import Bounds from './bounds'

export type PointType = Point | PointObject
export type PointObject = Pick<Point, 'x' | 'y'>
class Point {
	x: number
	y: number

	constructor(x?: number, y?: number) {
		this.x = x || 0
		this.y = y || 0
	}

	public isInBounds(bounds: Bounds) {
		return this.x >= bounds.left && this.x <= bounds.right && this.y >= bounds.top && this.y <= bounds.bottom
	}

	public atBoundary(bounds: Bounds, margin: number = 0) {
		if (this.x <= bounds.left + margin) {
			return 'left'
		} else if (this.x >= bounds.right - margin) {
			return 'right'
		} else if (this.y <= bounds.top + margin) {
			return 'top'
		} else if (this.y >= bounds.bottom - margin) {
			return 'bottom'
		}

		return ''
	}
}

export default Point
