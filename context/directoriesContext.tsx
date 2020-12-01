import React, { useEffect, useReducer } from 'react';
import Dir from '../models/dir';
import { ContextActionMap, PrettyPathPrefixes } from '../types/reactTypes';
import { getMainDirs, readStorage } from '../utils/storage/externalStorage';
import showToast from '../utils/showToast';
import { BASE_PATH } from '../constants/strings';

export type DirectoriesState = {
	loading: boolean;
	mainDirectories: Dir[];
	subDirectories: { [path: string]: Dir[] | undefined };
	currentPath: string;
	prettyPathPrefixes: PrettyPathPrefixes;
};

export enum DirectoriesActionTypes {
	SetLoading = 'SET_LOADING',
	SetMainDirectories = 'SET_MAIN_DIRS',
	SetDirectories = 'SET_DIRS',
	SetCurrentDir = 'SET_CURRENT_DIR',
	ResetState = 'RESET_STATE',
	SetPrettyPathPrefixes = 'SET_PRETTY_PATH_PREFIXES',
}

const initialState: DirectoriesState = {
	loading: false,
	mainDirectories: [],
	subDirectories: {},
	currentPath: BASE_PATH,
	prettyPathPrefixes: { '/storage/emulated/0': 'Device/Internal Storage' },
};

type ActionPayload = {
	[DirectoriesActionTypes.SetLoading]: boolean;
	[DirectoriesActionTypes.SetMainDirectories]: Dir[];
	[DirectoriesActionTypes.SetDirectories]: {
		dirs: Dir[];
		path: string;
	};
	[DirectoriesActionTypes.SetCurrentDir]: string;
	[DirectoriesActionTypes.ResetState]: undefined;
	[DirectoriesActionTypes.SetPrettyPathPrefixes]: PrettyPathPrefixes;
};

type DirectoriesActions = ContextActionMap<ActionPayload>[keyof ContextActionMap<
	ActionPayload
>];

const reducer = (
	state: DirectoriesState,
	action: DirectoriesActions,
): DirectoriesState => {
	switch (action.type) {
		case DirectoriesActionTypes.SetLoading:
			return {
				...state,
				loading: action.payload,
			};
		case DirectoriesActionTypes.SetCurrentDir:
			return {
				...state,
				currentPath: action.payload,
			};
		case DirectoriesActionTypes.SetMainDirectories:
			return {
				...state,
				mainDirectories: action.payload,
				loading: false,
			};
		case DirectoriesActionTypes.SetDirectories:
			const updatedSubDirs = { ...state.subDirectories };
			updatedSubDirs[action.payload.path] = action.payload.dirs;
			return {
				...state,
				subDirectories: updatedSubDirs,
			};
		case DirectoriesActionTypes.SetPrettyPathPrefixes: {
			return {
				...state,
				prettyPathPrefixes: action.payload,
			};
		}
		case DirectoriesActionTypes.ResetState: {
			const updatedState: DirectoriesState = {
				...(__DEV__ ? initialState : state),
				subDirectories: { [BASE_PATH]: [...state.subDirectories[BASE_PATH]!] },
			};
			return updatedState;
		}
		default:
			return state;
	}
};

export const DirectoriesContext = React.createContext<{
	directoriesState: DirectoriesState;
	dispatchDirectories: React.Dispatch<DirectoriesActions>;
}>({
	directoriesState: initialState,
	dispatchDirectories: () => null,
});

const DirectoriesContextProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	console.log('Current dir', state.currentPath);
	console.log('Sub directories: ', state.subDirectories);
	useEffect(() => {
		dispatch({
			type: DirectoriesActionTypes.SetLoading,
			payload: true,
		});

		getMainDirs()
			.then((mainDirs) => {
				dispatch({
					type: DirectoriesActionTypes.SetDirectories,
					payload: { dirs: mainDirs, path: BASE_PATH },
				});
			})
			.catch((err) => {
				showToast('Fail to read device files storage.', err.message);
			});
	}, []);

	useEffect(() => {
		if (state.currentPath !== BASE_PATH && !state.subDirectories[state.currentPath]) {
			readStorage(state.currentPath)
				.then((dirs) => {
					dispatch({
						type: DirectoriesActionTypes.SetDirectories,
						payload: {
							path: state.currentPath,
							dirs,
						},
					});
				})
				.catch((err) => {
					showToast('Fail to read device files storage.', err.message);
				});
		}
	}, [state.currentPath, state.subDirectories]);

	return (
		<DirectoriesContext.Provider
			value={{ directoriesState: state, dispatchDirectories: dispatch }}>
			{children}
		</DirectoriesContext.Provider>
	);
};

export default DirectoriesContextProvider;
