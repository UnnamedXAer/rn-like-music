import { BASE_PATH } from '../../constants/strings';
import { initialState } from './initialState';
import {
	DirectoriesStoreState,
	DirectoriesActionTypes,
	DirectoriesActions,
} from './types';

/**
 * @refactor
 */
const reducer = (
	state = initialState,
	action: DirectoriesActions,
): DirectoriesStoreState => {
	switch (action.type) {
		case DirectoriesActionTypes.SetLoading:
			return {
				...state,
				loading: action.payload,
			};
		case DirectoriesActionTypes.SetCurrentDir: {
			return {
				...state,
				currentPath: action.payload,
			};
		}
		case DirectoriesActionTypes.GoBack: {
			if (state.currentPath === BASE_PATH) {
				return state;
			}
			const pathElements = state.currentPath.split('/');
			pathElements.pop();
			const updatedPath = pathElements.join('/');
			return {
				...state,
				currentPath: updatedPath,
			};
		}
		case DirectoriesActionTypes.SetMainDirectories:
			return {
				...state,
				mainDirectories: action.payload,
				loading: false,
				mainDirectoriesRead: true,
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
			const updatedState: DirectoriesStoreState = {
				...(__DEV__ ? initialState : state),
				subDirectories: { [BASE_PATH]: [...state.subDirectories[BASE_PATH]!] },
				prettyPathPrefixes: { ...state.prettyPathPrefixes },
			};
			return updatedState;
		}
		default:
			return state;
	}
};

export default reducer;
