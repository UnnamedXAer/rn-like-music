import { PrettyPathPrefixes } from '../../types/reactTypes';

export const extractPrettyPathPrefixes = (dirs: string[]): PrettyPathPrefixes => {
	const prettyPrefixes: PrettyPathPrefixes = {};

	let sdCardCnt = 0;
	for (let i = 0; i < dirs.length; i++) {
		let dir = dirs[i];
		const isInternalStorage = dir.startsWith('/storage/emulated/0');
		if (isInternalStorage) {
			prettyPrefixes['/storage/emulated/0'] = 'Internal Storage';
			continue;
		}
		const diskPrettyName = 'SD Card' + (sdCardCnt === 0 ? '' : ' ' + sdCardCnt);
		const storageTxtLength = '/storage/'.length;
		const pathPrefix = dir.substring(0, dir.indexOf('/', storageTxtLength));
		prettyPrefixes[pathPrefix] = diskPrettyName;
	}

	return prettyPrefixes;
};
