// get an integer between min, max
export const between = (min:number, max:number) => {
  return Math.floor(Math.random() * (max-min+1)) + min
}

// generate weighted random boolean
export const chance = (weight:number=0.5) => {
  return (Math.random() <= weight) ? {
    bool:true,
    num:1
  } : {
    bool:false,
    num:-1
  }
}
