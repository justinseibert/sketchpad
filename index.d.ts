declare module '*.jpg' {
	const content: any
	export default content
}
declare module '*.png' {
	const content: any
	export default content
}
declare module '*.svg' {
	const content: any
	export default content
}

declare module 'crypto-browserify' {
	import * as cryptoBrowserify from 'crypto'

	export default cryptoBrowserify
}
