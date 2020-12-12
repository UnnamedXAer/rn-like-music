import TrackPlayer from 'react-native-track-player';
import { ThunkAction } from 'redux-thunk';
import Playable from '../../models/playable';
import { mapPlayableToTracks } from '../../utils/trackPlayer/mapData';
import { RootState } from '../types';
import { QueueActionTypes, SetTracks } from './types';
import * as PlayerActions from '../player/actions';

export const setQueueTracks = (
	songs: Playable[],
	resetQueue: boolean,
): ThunkAction<Promise<void>, RootState, any, SetTracks> => {
	return async (dispatch, _getState) => {
		try {
			if (resetQueue) {
				await TrackPlayer.reset();
			}
			const tracks = await mapPlayableToTracks(songs);
			await TrackPlayer.add(tracks);
			// @todo: check if the queue is play randomly
			await dispatch(PlayerActions.playTrack(songs[0]));

			// @todo: remember to merge here songs when not resetting queue
			dispatch({
				type: QueueActionTypes.SetTracks,
				payload: songs,
			});
		} catch (err) {
			await TrackPlayer.reset();
			throw err;
		}
	};
};
