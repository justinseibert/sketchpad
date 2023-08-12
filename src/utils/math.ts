// get an integer between min, max
export const between = (min: number, max: number, decimal: number = 0) => {
	decimal = 10 ** decimal
	const n = Math.random() * (max - min) + min
	return Math.floor(n * decimal) / decimal
}

export const random = (min: number, max: number) => {
	return between(min, max)
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

export const accumulateArray = (input: number[]): number[] => {
	let sum = 0
	return input.map((value) => (sum += value))
}
