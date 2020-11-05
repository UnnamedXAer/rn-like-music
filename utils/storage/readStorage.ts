import RNFS from 'react-native-fs';
import File from '../../models/file';

const plainDirs: string[] = [];
const files: File[] = [];

const loopThroughDirs = async (path: string) => {
	if (path === '/storage/emulated/0/Android/obb') {
		debugger;
	}
	const dirs = await RNFS.readDir(path);
	if (dirs) {
		for (let i = dirs.length - 1; i >= 0; i--) {
			const dir = dirs[i];
			if (!dir) {
				console.log('NO DIR', dir);
			} else if (dir.isDirectory()) {
				plainDirs.push(dir.path);
				console.log(dir.path);
				if (dir.path === '/storage/emulated/0/Android/obb') {
					debugger;
				}
				await loopThroughDirs(dir.path);
			} else {
				files.push(new File(dir.path, dir.name, +dir.size));
			}
		}
	} else {
		console.log('NO DIRS: ', dirs);
	}
};

const readStorage = async () => {
	await loopThroughDirs(RNFS.ExternalStorageDirectoryPath);
	return plainDirs;
};

export default readStorage;
