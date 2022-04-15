import Point from './point'

class Bounds {
	topRight: Point = new Point()
	bottomLeft: Point = new Point()
	center: Point = new Point()
	width: number = 0
	height: number = 0

	private _topLeft: Point
	private _bottomRight: Point

	constructor(topLeft?: Point, bottomRight?: Point) {
		this.topLeft = topLeft || new Point()
		this.bottomRight = bottomRight || new Point()
	}

	public get topLeft() {
		return this._topLeft
	}
	public set topLeft(value: Point) {
		this._topLeft = value
		this.topRight.y = value.y
		this.bottomLeft.x = value.x
		this.setWidthHeight()
		this.setCenter()
	}

	public get bottomRight() {
		return this._bottomRight
	}
	public set bottomRight(value: Point) {
		this._bottomRight = value
		this.topRight.x = value.x
		this.bottomLeft.y = value.y
		this.setWidthHeight()
		this.setCenter()
	}

	public get top() {
		return this.topLeft.y
	}
	public get bottom() {
		return this.bottomRight ? this.bottomRight.y : 0
	}
	public get left() {
		return this.topLeft.x
	}
	public get right() {
		return this.bottomRight ? this.bottomRight.x : 0
	}

	private setWidthHeight() {
		this.width = this.right - this.left
		this.height = this.bottom - this.top
	}
	private setCenter() {
		this.center.x = this.width / 2
		this.center.y = this.height / 2
	}
}

export default Bounds
