class Dir {
	constructor(
		public path: string,
		public name: string,
		public size: number,
		public isDirectory: boolean,
		public isFile: boolean,
		public subDirs?: Dir[],
		public parentIndexes?: number[],
	) {}
}

export default Dir;
