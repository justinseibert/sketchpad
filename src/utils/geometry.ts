import Point from 'src/models/point'

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
  return Math.abs(b-a)
}

// direction
export const direction = (from: number, to: number) => {
  return Math.sign(to - from)
}

// determine hypotenuse length of triangle
export const hypotenuse = (a: Point, b: Point) => {
  const A = a.x - b.x
  const B = a.y - b.y
  return Math.sqrt(A**2 + B**2)
}

// find the radian angle between two points
export const radianBetween = (a: Point, b: Point) => {
  return Math.atan2(b.y - a.y, b.x - a.x)
}

// find the degree angle between two points
export const degreeBetween = (a: Point, b: Point) => {
  const radian = radianBetween(a,b)
  return degree(radian)
}

// rotate a point around some origin
export const rotatePoint = (origin: Point | null, point: Point, radian: number) => {
  if (!origin) {
    origin = new Point(0,0)
  }

  // translate point by the origin
  const { x, y } = new Point(
    point.x - origin.x,
    point.y - origin.y,
  )

  return {
    x: (x * Math.cos(radian) - y * Math.sin(radian)) + origin.x,
    y: (y * Math.cos(radian) + x * Math.sin(radian)) + origin.y,
  }
}
