// get an integer between min, max
export const between = (min: number, max: number, decimal: number = 0) => {
	decimal = 10 ** decimal
	const n = Math.random() * (max - min) + min
	return Math.floor(n * decimal) / decimal
}

// generate weighted random boolean
export const chance = (weight: number = 0.5) => {
	return Math.random() <= weight
		? {
				bool: true,
				num: 1,
		  }
		: {
				bool: false,
				num: -1,
		  }
}
