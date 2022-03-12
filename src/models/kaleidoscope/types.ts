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
	algorithm?: UAlgorithm
}

export type UAlgorithm = 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512' | 'md5' | 'rmd160'
