import TrackPlayer, { Track } from 'react-native-track-player';
import Playable from '../../models/playable';
import { mapPlayableToTracks } from '../../utils/trackPlayer/mapData';
import { ThunkResult } from '../types';
import { QueueActionTypes, QueueStoreState, QueueSetTracksAction } from './types';
import * as PlayerActions from '../player/actions';
import { SetCurrentTrackAction, SetPlayerDestroyedAction } from '../player/types';

export const setQueueTracks = (
	newTracks: Playable[],
	resetQueue: boolean,
): ThunkResult<QueueSetTracksAction> => {
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

			dispatch({
				type: QueueActionTypes.SetTracks,
				payload: currentTracks,
			});
		} catch (err) {
			// @todo: test it, probably state should be cleaned
			await TrackPlayer.reset();
			throw err;
		}
	};
};

export const addStateQueueToPlayer = (): ThunkResult<
	SetCurrentTrackAction | SetPlayerDestroyedAction
> => {
	return async (dispatch, getState) => {
		const state = getState();
		const {
			queue: { tracks: playableItems },
			player: { currentTrack },
		} = state;

		if (playableItems.length === 0) {
			// ? what to do here?
			return;
		}

		try {
			await TrackPlayer.reset();
			const tracks = await mapPlayableToTracks(playableItems);
			await TrackPlayer.add(tracks);
			if (currentTrack !== null) {
				await TrackPlayer.skip(currentTrack.path);
			} else {
				// @thought: I suppose this scenario should not happen...
				// @thought: because if we have the queue items then we should also have the current track
				dispatch(PlayerActions.setCurrentTrack(playableItems[0]));
			}
			dispatch(PlayerActions.setPlayerDestroyed(false));
		} catch (err) {
			await TrackPlayer.reset();
			throw err;
		}
	};
};

export const removeQueueTrack = (
	trackPath: Playable['path'],
): ThunkResult<QueueSetTracksAction> => {
	return async (dispatch, getState) => {
		const {
			queue: { tracks },
			player: { currentTrack },
		} = getState();

		const updatedTracks = tracks.filter((track) => track.path !== trackPath);

		try {
			if (currentTrack?.path === trackPath) {
				if (updatedTracks.length === 0) {
					await TrackPlayer.stop();
				} else {
					await dispatch(PlayerActions.skipTrack('next'));
				}
			}
			// @todo: what if I try to remove track not in queue, will it fail?
			console.log(await TrackPlayer.getCurrentTrack());
			console.log(await TrackPlayer.getQueue());
			// const _track = await TrackPlayer.getTrack(trackPath);
			await TrackPlayer.remove((trackPath as unknown) as Track);
			console.log(await TrackPlayer.getQueue());
			dispatch({
				type: QueueActionTypes.SetTracks,
				payload: updatedTracks,
			});
		} catch (err) {
			// @todo: test it, probably state should be cleaned
			await TrackPlayer.reset();
			throw err;
		}
	};
};
