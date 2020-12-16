import { SimpleReducer } from '../types';
import { playerInitialState as initialState } from './initialState';
import {
	PlayerActions,
	PlayerActionTypes,
	PlayerStoreState,
	SetCurrentTrackAction,
} from './types';

const setCurrentTrack: SimpleReducer<PlayerStoreState, SetCurrentTrackAction> = (
	state,
	action,
) => {
	return {
		...state,
		currentTrack: action.payload,
	};
};

const reducer = (state = initialState, action: PlayerActions): PlayerStoreState => {
	switch (action.type) {
		case PlayerActionTypes.SetCurrentTrack:
			return setCurrentTrack(state, action);
		case PlayerActionTypes.SetIsPlaying:
			return {
				...state,
				isPlaying: action.payload,
			};
		case PlayerActionTypes.ToggleFlag:
			return {
				...state,
				[action.payload]: !state[action.payload],
			};
		case PlayerActionTypes.SetPlayerInitialized:
			return {
				...state,
				initialized: action.payload,
			};
		case PlayerActionTypes.SetPlayerDestroyed:
			return {
				...state,
				destroyed: action.payload,
			};
		default:
			return state;
	}
};

export default reducer;
