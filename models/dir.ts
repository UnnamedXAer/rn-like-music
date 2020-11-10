class Dir {
	constructor(
		public path: string,
		public name: string,
		public size: number,
		public isDirectory: boolean,
		public isFile: boolean,
	) {}
}

export default Dir;
