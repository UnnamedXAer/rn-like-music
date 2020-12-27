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
			currentTracks = getState().queue.tracks.concat(currentTracks);
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

// @refactor
export const removeQueueTrack = (
	trackPath: Playable['path'],
): ThunkResult<QueueSetTracksAction | SetCurrentTrackAction> => {
	return async (dispatch, getState) => {
		const {
			queue: { tracks },
			player: { currentTrack, isPlaying },
		} = getState();

		const updatedTracks = tracks.filter((track) => track.path !== trackPath);

		// @info: the app crashes when try to delete track with two tracks in queue.
		// @i: if this bug didn't exist we would use [stop+ skip] as workaround because
		// @i: the player does not delete track if that track is currently played.
		if (updatedTracks.length < 2) {
			const position = await TrackPlayer.getPosition();
			await TrackPlayer.reset();
			if (updatedTracks.length > 0) {
				await TrackPlayer.add(await mapPlayableToTracks(updatedTracks));
				if (currentTrack?.path === trackPath) {
					await dispatch(PlayerActions.skipTrack('next'));
				} else {
					await TrackPlayer.seekTo(position);
				}
				if (isPlaying) {
					await TrackPlayer.play();
				}
			} else {
				await dispatch(PlayerActions.playTrack(null));
			}
		} else {
			if (currentTrack?.path === trackPath) {
				await dispatch(PlayerActions.skipTrack('next'));
			}
			await TrackPlayer.remove((trackPath as unknown) as Track);
		}
		dispatch({
			type: QueueActionTypes.SetTracks,
			payload: updatedTracks,
		});
	};
};
