import RNFS from 'react-native-fs';
import Dir from '../../models/dir';

const loopThroughDirs = async (path: string) => {
	const dirs = await RNFS.readDir(path);
	if (dirs) {
		const elements: Dir[] = [];
		for (let i = dirs.length - 1; i >= 0; i--) {
			const dir = dirs[i];
			if (!dir) {
				console.log('NO DIR', dir);
			} else if (dir.isDirectory()) {
				elements.push(
					new Dir(
						dir.path,
						dir.name,
						+dir.size,
						dir.isDirectory(),
						dir.isFile(),
					),
				);
			}
		}
		return elements;
	} else {
		console.log('NO DIRS: ', dirs);
		throw new Error('Unable to read directory: ' + path);
	}
};

const readStorage = async (path: string) => {
	return await loopThroughDirs(path);
};

export default readStorage;
