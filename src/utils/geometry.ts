import { PointType } from 'src/models/point'

export const r360 = 2 * Math.PI
export const r180 = r360 / 2
export const r90 = r180 / 2

// Convert degree to radian
export const degree = (radian: number) => {
	return radian * (180 / Math.PI)
}

// Convert radian to degree
export const radian = (degree: number) => {
	return degree * (Math.PI / 180)
}

// the absolute distance/length between a and b
export const distance = (a: number, b: number) => {
	return Math.abs(b - a)
}

// direction
export const direction = (from: number, to: number) => {
	return Math.sign(to - from)
}

// determine hypotenuse length of triangle
export const hypotenuse = (sideA: number, sideB: number) => {
	return Math.sqrt(sideA * sideA + sideB * sideB)
}

// find the radian angle between two points
export const radianBetween = (a: PointType, b: PointType) => {
	return Math.atan2(b.y - a.y, b.x - a.x)
}

// find the degree angle between two points
export const degreeBetween = (a: PointType, b: PointType) => {
	const radian = radianBetween(a, b)
	return degree(radian)
}

export const rotatePoint = (origin: PointType | null, point: PointType, radian: number) => {
	if (!origin) {
		origin = { x: 0, y: 0 }
	}

	// translate point by the origin
	const { x, y } = { x: point.x - origin.x, y: point.y - origin.y }

	return {
		x: x * Math.cos(radian) - y * Math.sin(radian) + origin.x,
		y: y * Math.cos(radian) + x * Math.sin(radian) + origin.y,
	}
}
