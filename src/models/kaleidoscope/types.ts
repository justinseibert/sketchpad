export interface IChunk {
	radius: string
	offset: string
	slice: string
}

export interface IAttribute {
	radius: number
	offset: number
	slices: number
}

export interface IOptions {
	input?: string
	size?: number
}
