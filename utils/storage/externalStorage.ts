import RNFS from 'react-native-fs';
import Dir from '../../models/dir';
import { extractPrettyPathPrefixes } from './extractPrettyPathPrefixes';

const loopThroughDirs = async (path: string) => {
	const dirs = await RNFS.readDir(path);
	if (dirs) {
		const elements: Dir[] = [];
		for (let i = dirs.length - 1; i >= 0; i--) {
			const dir = dirs[i];
			if (!dir) {
				console.log('NO DIR', dir);
				continue;
			}
			const dirPath = dir.path.startsWith('/storage/emulated/0')
				? dir.path.replace('/storage/emulated/0', '/Device/Internal Storage')
				: dir.path;
			elements.push(
				new Dir(
					dir.path,
					dirPath,
					dir.name,
					+dir.size,
					dir.isDirectory(),
					dir.isFile(),
				),
			);
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
			if (dir.isFile()) {
				if (dir.name.endsWith('.mp3')) {
					songs.push(
						new Dir(dir.path, dir.path, dir.name, +dir.size, false, true),
					);
				}
				continue;
			}
			console.log('NOT a direction and NOT a file!!!', dir);
		}
	} while (paths.length > 0);
	return songs;
};

export const getMainDirs = async () => {
	const dirs = await RNFS.getAllExternalFilesDirs();

	const prettyPathPrefixes = extractPrettyPathPrefixes(dirs);

	const mainDirs: Dir[] = [];
	let sdCardCnt = 0;
	for (let i = 0; i < dirs.length; i++) {
		let dir = dirs[i];
		const isInternalStorage = dir.startsWith('/storage/emulated/0');
		const idx = dir.indexOf('/Android/data/com.likemusic/');
		dir = dir.substring(0, idx);
		if (isInternalStorage) {
			const dirName = 'Internal Storage';
			dir = `/Device/${dirName}`;

			mainDirs.push(new Dir(dirs[i], dir, dirName, 0, true, false));
			continue;
		}
		const dirName = 'SD Card' + (sdCardCnt === 0 ? '' : ' ' + sdCardCnt);
		dir = `/Device/${dirName}`;

		mainDirs.push(new Dir(dirs[i], dir, dirName, 0, true, false));
		sdCardCnt++;
	}
	return { mainDirs, prettyPathPrefixes };
};

export const getDirInfo = async (path: string) => {
	const dirStat = await RNFS.readFileAssets('file://' + path, {});
	console.log('Dir Info => ', dirStat);
	return '';
};

export const readStorage = async (path: string) => {
	return await loopThroughDirs(path);
};

export const readStorageFile = async (filePath: string) => {
	return await readFile(filePath);
};
