import RNFS from 'react-native-fs';
import Dir from '../../models/dir';
import { DirStat } from '../../models/dirStat';
import Playable from '../../models/playable';
import showToast from '../showToast';
import { isFilePlayable } from './isFilePlayable';
import { extractPrettyPathPrefixes } from './prettyPathPrefixes';

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

			if (dir.isDirectory()) {
				elements.push(new Dir(dir.path, '', dir.name));
				continue;
			}
			if (isFilePlayable(dir.name)) {
				elements.push(new Playable(dir.path, '', dir.name));
				continue;
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
	} else {
		console.log('NO DIRS: ', results);
		throw new Error('Unable to read directory: ' + path);
	}
};

export const getDirSongs = async (path: string) => {
	const songs: Playable[] = [];
	const paths: string[] = [path];
	const errors: { [path: string]: string } = {};

	do {
		const currentPath = paths.shift()!;
		let dirs: RNFS.ReadDirItem[] | null = null;
		try {
			dirs = await RNFS.readDir(currentPath);
		} catch (err) {
			errors[currentPath] = err.message;
		}

		if (dirs !== null) {
			for (let i = dirs.length - 1; i >= 0; i--) {
				const dir = dirs[i];
				if (dir.isDirectory()) {
					paths.push(dir.path);
					continue;
				}
				if (isFilePlayable(dir.name)) {
					songs.push(new Playable(dir.path, dir.path, dir.name));
					continue;
				}
			}
		}
	} while (paths.length > 0);

	if (__DEV__ && Object.keys(errors).length > 0) {
		console.log('[getDirSongs] ', errors);
		showToast('There were problems with some paths. Checkout the console logs.');
	}

	return songs;
};

export const getMainDirsAndPrettyPrefixes = async () => {
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
			const prettyDir = `/Device/${dirName}`;

			mainDirs.push(new Dir(dir, prettyDir, dirName));
			continue;
		}
		const dirName = 'SD Card' + (sdCardCnt === 0 ? '' : ' ' + sdCardCnt);
		const prettyDir = `/Device/${dirName}`;

		mainDirs.push(new Dir(dir, prettyDir, dirName));
		sdCardCnt++;
	}
	return { mainDirs, prettyPathPrefixes };
};

export const getDirInfo = async (dir: Dir | Playable) => {
	console.log('path', dir.path);
	const statResult = await RNFS.stat('file://' + dir.path);
	const dirStat = new DirStat(
		dir.path,
		dir.prettyPath,
		dir.name,
		dir instanceof Playable ? 'file' : 'folder',
		+statResult.size,
	);
	return dirStat;
};

export const readStorage = async (path: string) => {
	return await loopThroughDirs(path);
};

export const readStorageFile = async (filePath: string) => {
	return await readFile(filePath);
};
