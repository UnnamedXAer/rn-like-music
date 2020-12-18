import Dir from './dir';

export class DirStat extends Dir {
	constructor(
		public path: string,
		public prettyPath: string,
		public name: string,
		public type: 'file' | 'folder',
		public size: number,
	) {
		super(path, prettyPath, name);
	}
}
