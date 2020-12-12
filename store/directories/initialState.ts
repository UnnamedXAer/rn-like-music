import { BASE_PATH } from '../../constants/strings';
import { DirectoriesStoreState } from './types';

export const initialState: DirectoriesStoreState = {
	loading: false,
	mainDirectories: [],
	subDirectories: {},
	currentPath: BASE_PATH,
	prettyPathPrefixes: { '/storage/emulated/0': 'Device/Internal Storage' },
	mainDirectoriesRead: false,
};
