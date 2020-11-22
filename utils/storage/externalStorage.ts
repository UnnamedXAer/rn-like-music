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

export const getDirSongs = async (path: string) => {
	const songs: Dir[] = [];
	const paths: string[] = [path];
	do {
		const currentPath = paths.shift()!;
		const dirs = await RNFS.readDir(currentPath);

		for (let i = dirs.length - 1; i >= 0; i--) {
			const dir = dirs[i];
			if (dir.isDirectory()) {
				paths.push(dir.path);
				continue;
			}
			if (dir.isFile() && dir.name.endsWith('.mp3')) {
				songs.push(new Dir(dir.path, dir.name, +dir.size, false, true));
				continue;
			}
			console.log('NOT a direction and NOT a file!!!', dir);
		}
	} while (paths.length > 0);
	return songs;
};

export const getDirInfo = async (path: string) => {
	const dirStat = await RNFS.readFileAssets(path, {});
	console.log(dirStat);
	return '';
};

export const readStorage = async (path: string) => {
	return await loopThroughDirs(path);
};
export const readStorageFile = async (filePath: string) => {
	return await readFile(filePath);
};
