import {
	PlayerActionPayload,
	PlayerActionTypes,
	SetCurrentTrackAction,
	SetIsPlayingAction,
	TogglePlayerParameter,
} from './types';
import TrackPlayer from 'react-native-track-player';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../types';
import Playable from '../../models/playable';
import { getNextTrackInDirection } from '../../utils/trackPlayer/playerQueue';

export const playTrack = (
	track: Playable | null,
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	SetCurrentTrackAction | SetIsPlayingAction
> => {
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

export const togglePlay = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	SetIsPlayingAction
> => {
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
): ThunkAction<Promise<void>, RootState, any, SetCurrentTrackAction> => {
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
