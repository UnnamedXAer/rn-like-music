import Dir from './dir';

class Playable extends Dir {
	constructor(path: string, prettyPath: string, name: string) {
		super(path, prettyPath, name);
	}
}

export default Playable;
