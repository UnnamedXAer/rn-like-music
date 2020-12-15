import {
	PlayerActionPayload,
	PlayerActionTypes,
	SetCurrentTrackAction,
	SetIsPlayingAction,
	SetPlayerInitializedAction,
	TogglePlayerParameter,
} from './types';
import TrackPlayer from 'react-native-track-player';
import Playable from '../../models/playable';
import { getNextTrackInDirection } from '../../utils/trackPlayer/playerQueue';
import { ThunkResult } from '../types';

export const setPlayerInitialized = (
	initialized: boolean,
): SetPlayerInitializedAction => {
	console.log('[setPlayerInitialized]', initialized);
	return {
		type: PlayerActionTypes.SetPlayerInitialized,
		payload: initialized,
	};
};

export const playTrack = (
	track: Playable | null,
): ThunkResult<SetCurrentTrackAction | SetIsPlayingAction> => {
	return async (dispatch, getState) => {
		try {
			if (track !== null) {
				await TrackPlayer.skip(track.path);
				const isPlaying = getState().player.isPlaying;
				if (isPlaying === false) {
					await TrackPlayer.play();
					dispatch(setIsPlaying(true));
				}
			}

			dispatch({
				type: PlayerActionTypes.SetCurrentTrack,
				payload: track,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const togglePlay = (): ThunkResult<SetIsPlayingAction> => {
	return async (dispatch, getState) => {
		try {
			const isPlaying = getState().player.isPlaying;
			if (isPlaying === true) {
				await TrackPlayer.pause();
				dispatch(setIsPlaying(false));
				return;
			}
			await TrackPlayer.play();
			dispatch(setIsPlaying(true));
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

export const setIsPlaying = (isPlaying: boolean): SetIsPlayingAction => {
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
