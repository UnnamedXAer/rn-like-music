import { SimpleReducer } from '../types';
import { initialState } from './initialState';
import {
	QueueActions,
	QueueActionTypes,
	QueueStoreState,
	QueueSetTracksAction,
} from './types';

const setTracks: SimpleReducer<QueueStoreState, QueueSetTracksAction> = (
	state,
	action,
) => {
	const updatedState: QueueStoreState = {
		...state,
		tracks: action.payload,
	};
	return updatedState;
};

const reducer = (state = initialState, action: QueueActions) => {
	switch (action.type) {
		case QueueActionTypes.SetTracks:
			return setTracks(state, action);

		default:
			return state;
	}
};

export default reducer;
