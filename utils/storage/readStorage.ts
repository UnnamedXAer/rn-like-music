import RNFS from 'react-native-fs';
import Dir from '../../models/dir';

const loopThroughDirs = async (path: string) => {
	const dirs = await RNFS.readDir(path);
	console.log(path, 'dirs', dirs);
	if (dirs) {
		const elements: Dir[] = [];
		for (let i = dirs.length - 1; i >= 0; i--) {
			const dir = dirs[i];
			if (!dir) {
				console.log('NO DIR', dir);
			} else {
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

const readFile = async (path: string) => {
	const results = await RNFS.readFile('file://' + path, 'base64');
	console.log(path, 'results', results);
	if (results) {
		return results;
		// const elements: Dir[] = [];
		// for (let i = dirs.length - 1; i >= 0; i--) {
		// 	const dir = dirs[i];
		// 	if (!dir) {
		// 		console.log('NO DIR', dir);
		// 	} else {
		// 		elements.push(
		// 			new Dir(
		// 				dir.path,
		// 				dir.name,
		// 				+dir.size,
		// 				dir.isDirectory(),
		// 				dir.isFile(),
		// 			),
		// 		);
		// 	}
		// }
		// return elements;
	} else {
		console.log('NO DIRS: ', results);
		throw new Error('Unable to read directory: ' + path);
	}
};

export const readStorage = async (path: string) => {
	return await loopThroughDirs(path);
};
export const readStorageFile = async (filePath: string) => {
	return await readFile(filePath);
};
