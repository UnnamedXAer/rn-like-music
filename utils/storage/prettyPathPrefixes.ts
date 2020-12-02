import { PrettyPathPrefixes } from '../../types/reactTypes';

export const extractPrettyPathPrefixes = (dirs: string[]): PrettyPathPrefixes => {
	const prettyPrefixes: PrettyPathPrefixes = {};

	let sdCardCnt = 0;
	for (let i = 0; i < dirs.length; i++) {
		let dir = dirs[i];
		const isInternalStorage = dir.startsWith('/storage/emulated/0');
		if (isInternalStorage) {
			prettyPrefixes['/storage/emulated/0'] = '/Device/' + 'Internal Storage';
			continue;
		}
		const diskPrettyName = 'SD Card' + (sdCardCnt === 0 ? '' : ' ' + sdCardCnt);
		const storageTxtLength = '/storage/'.length;
		const pathPrefix = dir.substring(0, dir.indexOf('/', storageTxtLength));
		prettyPrefixes[pathPrefix] = '/Device/' + diskPrettyName;
	}

	return prettyPrefixes;
};

export const getPathByPrettyPath = (
	prettyPath: string,
	prettyPathPrefixes: PrettyPathPrefixes,
) => {
	for (const path in prettyPathPrefixes) {
		if (prettyPath.startsWith(prettyPathPrefixes[path])) {
			return prettyPath.replace(prettyPathPrefixes[path], path);
		}
	}

	throw new Error('Could not find path for the pretty path: "' + prettyPath + '"');
};
