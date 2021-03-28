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
export const hypotenuse = (sideA: number, sideB: number) => {
  return Math.sqrt(sideA*sideA + sideB*sideB)
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
