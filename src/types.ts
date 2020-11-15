export interface PointType {
  x: number
  y: number
}

export interface BoxType {
  w: number
  h: number
}

export interface StrokeType {
  color: ColorType
  points: PointType[]
  getHSL: () => string
}

export interface ColorType {
  h: number
  s: number
  l: number
}

export interface CanvasType {
  box: BoxType
  center: PointType
  dpi: number
  margin: number
  ctx: CanvasRenderingContext2D
  background: ColorType
}

export interface IntervalType {
  cancel: () => void
}
