import Dir from '../../models/dir';
import { PrettyPathPrefixes } from '../../types/reactTypes';

export enum DirectoriesActionTypes {
	SetLoading = 'DIRECTORIES_SET_LOADING',
	SetMainDirectories = 'DIRECTORIES_SET_MAIN_DIRS',
	SetDirectories = 'DIRECTORIES_SET_DIRS',
	SetCurrentDir = 'DIRECTORIES_SET_CURRENT_DIR',
	ResetState = 'DIRECTORIES_RESET_STATE',
	SetPrettyPathPrefixes = 'DIRECTORIES_SET_PRETTY_PATH_PREFIXES',
	GoBack = 'DIRECTORIES_GO_BACK',
}

export interface DirectoriesStoreState {
	readonly loading: boolean;
	readonly mainDirectories: Dir[];
	readonly subDirectories: { [path: string]: Dir[] | undefined };
	readonly currentPath: string;
	readonly prettyPathPrefixes: PrettyPathPrefixes;
	readonly mainDirectoriesRead: boolean;
}

export type DirectoriesActionPayload = {
	[DirectoriesActionTypes.SetLoading]: boolean;
	[DirectoriesActionTypes.SetMainDirectories]: Dir[];
	[DirectoriesActionTypes.SetDirectories]: {
		dirs: Dir[];
		path: string;
	};
	[DirectoriesActionTypes.SetCurrentDir]: string;
	[DirectoriesActionTypes.ResetState]: undefined;
	[DirectoriesActionTypes.SetPrettyPathPrefixes]: PrettyPathPrefixes;
	[DirectoriesActionTypes.GoBack]: undefined;
};

interface SetLoading {
	type: DirectoriesActionTypes.SetLoading;
	payload: DirectoriesActionPayload[DirectoriesActionTypes.SetLoading];
}
interface SetMainDirectories {
	type: DirectoriesActionTypes.SetMainDirectories;
	payload: DirectoriesActionPayload[DirectoriesActionTypes.SetMainDirectories];
}
interface SetDirectories {
	type: DirectoriesActionTypes.SetDirectories;
	payload: DirectoriesActionPayload[DirectoriesActionTypes.SetDirectories];
}
interface SetCurrentDir {
	type: DirectoriesActionTypes.SetCurrentDir;
	payload: DirectoriesActionPayload[DirectoriesActionTypes.SetCurrentDir];
}
interface ResetState {
	type: DirectoriesActionTypes.ResetState;
	payload: DirectoriesActionPayload[DirectoriesActionTypes.ResetState];
}
interface SetPrettyPathPrefixes {
	type: DirectoriesActionTypes.SetPrettyPathPrefixes;
	payload: DirectoriesActionPayload[DirectoriesActionTypes.SetPrettyPathPrefixes];
}
interface GoBack {
	type: DirectoriesActionTypes.GoBack;
	payload: DirectoriesActionPayload[DirectoriesActionTypes.GoBack];
}

export type DirectoriesActions =
	| SetLoading
	| SetMainDirectories
	| SetDirectories
	| SetCurrentDir
	| ResetState
	| SetPrettyPathPrefixes
	| GoBack;
