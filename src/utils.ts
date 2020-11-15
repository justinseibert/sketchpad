import { PointType } from '@/types'

// Convert degree to radian
const degree = (radian:number) => {
  return radian * (180 / Math.PI)
}

// Convert radian to degree
const radian = (degree:number) => {
  return degree * (Math.PI / 180)
}

// get an integer between min, max
const between = (min:number, max:number) => {
  return Math.floor(Math.random() * (max-min+1)) + min
}

// the absolute distance/length between a and b
const distance = (a:number, b:number) => {
  return Math.abs(b-a);
}

// determine hypotenuse length of triangle
const hypotenuse = (sideA:number,sideB:number) => {
  return Math.sqrt(sideA*sideA + sideB*sideB);
}

// find the radian angle between two points
const radianBetween = (a:PointType, b:PointType) => {
  return Math.atan2(b.y - a.y, b.x - a.x)
}

// find the degree angle between two points
const degreeBetween = (a:PointType, b:PointType) => {
  const radian = radianBetween(a,b)
  return degree(radian)
}

// generate weighted random boolean
const chance = (weight:number=0.5) => {
  return (Math.random() <= weight) ? {
    bool:true,
    num:1
  } : {
    bool:false,
    num:-1
  }
}

const requestInterval = (interval:number, callback: () => void) => {
  let start = Date.now(),
      cancel = false

  const onInterval = () => {
    cancel || Date.now() - start > interval ? callback() : window.requestAnimationFrame(onInterval)
  }

  window.requestAnimationFrame(onInterval)

  return {
    cancel: () => cancel = true
  }
}

export default {
  between,
  chance,
  degree,
  degreeBetween,
  distance,
  hypotenuse,
  radian,
  radianBetween,
  requestInterval,
}
