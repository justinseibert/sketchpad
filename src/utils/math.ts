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