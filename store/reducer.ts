import { combineReducers } from 'redux';
import DirectoriesReducer from './directories/reducer';
import PlayerReducer from './player/reducer';
import QueueReducer from './queue/reducer';

export default combineReducers({
	directories: DirectoriesReducer,
	player: PlayerReducer,
	queue: QueueReducer,
});
