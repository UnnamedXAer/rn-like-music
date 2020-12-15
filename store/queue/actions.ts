import TrackPlayer from 'react-native-track-player';
import Playable from '../../models/playable';
import { mapPlayableToTracks } from '../../utils/trackPlayer/mapData';
import { ThunkResult } from '../types';
import { QueueActionTypes, QueueStoreState, SetTracks } from './types';
import * as PlayerActions from '../player/actions';

export const setQueueTracks = (
	newTracks: Playable[],
	resetQueue: boolean,
): ThunkResult<SetTracks> => {
	return async (dispatch, getState) => {
		let currentTracks: QueueStoreState['tracks'] = [...newTracks];

		if (resetQueue === false) {
			currentTracks = currentTracks.concat(getState().queue.tracks);
		}

		try {
			if (resetQueue) {
				await TrackPlayer.reset();
			}
			const tracks = await mapPlayableToTracks(newTracks);
			await TrackPlayer.add(tracks);
			// @todo: check if the queue is play randomly
			await dispatch(PlayerActions.playTrack(newTracks[0]));

			// @todo: remember to merge songs when not resetting queue

			dispatch({
				type: QueueActionTypes.SetTracks,
				payload: currentTracks,
			});
		} catch (err) {
			await TrackPlayer.reset();
			throw err;
		}
	};
};
