import {
	PlayerActionPayload,
	PlayerActionTypes,
	SetCurrentTrackAction,
	SetIsPlayingAction,
	SetPlayerDestroyedAction,
	SetPlayerInitializedAction,
	TogglePlayerParameter,
} from './types';
import TrackPlayer from 'react-native-track-player';
import Playable from '../../models/playable';
import { getNextTrackInDirection } from '../../utils/trackPlayer/playerQueue';
import { ThunkResult } from '../types';
import { AppState } from 'react-native';

export const setPlayerInitialized = (
	initialized: boolean,
): SetPlayerInitializedAction => {
	console.log('[setPlayerInitialized]', initialized);
	return {
		type: PlayerActionTypes.SetPlayerInitialized,
		payload: initialized,
	};
};
export const setPlayerDestroyed = (destroyed: boolean): SetPlayerDestroyedAction => {
	return {
		type: PlayerActionTypes.SetPlayerDestroyed,
		payload: destroyed,
	};
};

export const stopPlayer = (): ThunkResult<
	SetPlayerDestroyedAction | SetIsPlayingAction
> => {
	return async (dispatch, _getState) => {
		const action = AppState.currentState === 'active' ? 'stop' : 'destroy';
		try {
			if (AppState.currentState === 'active') {
				// await TrackPlayer.stop();
				await TrackPlayer.seekTo(0);
				await TrackPlayer.pause();
			} else {
				await TrackPlayer.destroy();
				dispatch(setPlayerDestroyed(true));
			}
			dispatch(setPlayerIsPlaying(false));
		} catch (err) {
			console.log("Couldn't " + action + ' track player');
		}
	};
};

export const playTrack = (
	track: Playable | null,
): ThunkResult<SetCurrentTrackAction | SetIsPlayingAction> => {
	return async (dispatch, getState) => {
		const isPlaying = getState().player.isPlaying;
		try {
			if (track !== null) {
				await TrackPlayer.skip(track.path);

				if (isPlaying === false) {
					await TrackPlayer.play();
					dispatch(setPlayerIsPlaying(true));
				}
			} else {
				if (isPlaying === true) {
					// @thought: need to test with "stop"
					await TrackPlayer.pause();
					dispatch(setPlayerIsPlaying(false));
				}
			}

			dispatch(setCurrentTrack(track));
		} catch (err) {
			// @todo: remove track from state if play action fails.
			throw err;
		}
	};
};

export const setCurrentTrack = (
	track: PlayerActionPayload[PlayerActionTypes.SetCurrentTrack],
): SetCurrentTrackAction => {
	return {
		type: PlayerActionTypes.SetCurrentTrack,
		payload: track,
	};
};

export const togglePlay = (): ThunkResult<SetIsPlayingAction> => {
	return async (dispatch, getState) => {
		try {
			const isPlaying = getState().player.isPlaying;
			if (isPlaying === true) {
				await TrackPlayer.pause();
				dispatch(setPlayerIsPlaying(false));
				return;
			}
			await TrackPlayer.play();
			dispatch(setPlayerIsPlaying(true));
		} catch (err) {
			throw err;
		}
	};
};

export const skipTrack = (
	direction: 'next' | 'previous',
): ThunkResult<SetCurrentTrackAction> => {
	return async (dispatch, getState) => {
		const {
			queue: { tracks },
			player: { currentTrack, random },
		} = getState();
		try {
			const track = getNextTrackInDirection(
				direction,
				tracks,
				currentTrack,
				random,
			);

			await dispatch(playTrack(track));
		} catch (err) {
			throw err;
		}
	};
};

export const setPlayerIsPlaying = (isPlaying: boolean): SetIsPlayingAction => {
	return {
		type: PlayerActionTypes.SetIsPlaying,
		payload: isPlaying,
	};
};

export const togglePlayerParameter = (
	paramName: PlayerActionPayload[PlayerActionTypes.ToggleFlag],
): TogglePlayerParameter => {
	return {
		type: PlayerActionTypes.ToggleFlag,
		payload: paramName,
	};
};
