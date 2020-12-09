import React, { useEffect, useReducer } from 'react';
import TrackPlayer, {
	Event,
	Track,
	useTrackPlayerEvents,
} from 'react-native-track-player';
import Dir from '../models/dir';
import { ContextActionMap } from '../types/reactTypes';
import { getCurrentTracks, getQueueOrder } from '../utils/queue';
import showToast from '../utils/showToast';

export type TracksState = {
	queue: Dir[];
	currentTrack: Dir | null;
	nextTrack: Dir | null;
	previousTrack: Dir | null;
	playRandomly: boolean;
	repeatQueue: boolean;
	queueOrder: number[];
};

export enum TracksActionTypes {
	UpdateQueue = 'UPDATE_QUEUE',
	UpdateQueueOrder = 'UPDATE_QUEUE_ORDER',
	SetCurrentTrack = 'SET_CURRENT_TRACK',
	TogglePlayRandomly = 'TOGGLE_PLAY_RANDOMLY',
	ToggleRepeatQueue = 'TOGGLE_REPEAT_QUEUE',
}

const initialState: TracksState = {
	queue: [],
	currentTrack: null,
	nextTrack: null,
	previousTrack: null,
	playRandomly: false,
	repeatQueue: false,
	queueOrder: [],
};

type ActionPayload = {
	[TracksActionTypes.UpdateQueue]: { add?: Dir[]; remove?: string[]; reset?: boolean };
	[TracksActionTypes.UpdateQueueOrder]: undefined;
	[TracksActionTypes.SetCurrentTrack]: Dir | null;
	[TracksActionTypes.TogglePlayRandomly]: undefined;
	[TracksActionTypes.ToggleRepeatQueue]: undefined;
};

type TracksActions = ContextActionMap<ActionPayload>[keyof ContextActionMap<
	ActionPayload
>];

const reducer = (state: TracksState, action: TracksActions): TracksState => {
	switch (action.type) {
		case TracksActionTypes.UpdateQueue: {
			let updatedQueue: Dir[] =
				action.payload.reset === true && action.payload.add
					? []
					: [...state.queue];

			if (action.payload.add) {
				updatedQueue = updatedQueue.concat(action.payload.add);
			}

			if (action.payload.remove) {
				action.payload.remove.forEach((songPath) => {
					const idx = updatedQueue!.findIndex((x) => x.path === songPath);
					if (idx > -1) {
						updatedQueue!.splice(idx, 1);
					}
				});
			}

			const updatedQueueOrder = getQueueOrder(
				updatedQueue.length,
				state.playRandomly,
			);

			const { currentTrack, nextTrack, prevTrack } = getCurrentTracks(
				state.currentTrack,
				updatedQueue!,
				updatedQueueOrder,
			);

			return {
				...state,
				queue: updatedQueue!,
				queueOrder: updatedQueueOrder,
				currentTrack: currentTrack,
				nextTrack: nextTrack,
				previousTrack: prevTrack,
			};
		}
		case TracksActionTypes.UpdateQueueOrder: {
			const updatedPlayRandomly = state.playRandomly;
			const updatedQueueOrder = getQueueOrder(
				state.queue.length,
				updatedPlayRandomly,
			);

			return {
				...state,
				queueOrder: updatedQueueOrder,
			};
		}
		case TracksActionTypes.SetCurrentTrack: {
			const { currentTrack, nextTrack, prevTrack } = getCurrentTracks(
				action.payload,
				state.queue,
				state.queueOrder,
			);

			return {
				...state,
				currentTrack: currentTrack,
				nextTrack: nextTrack,
				previousTrack: prevTrack,
			};
		}
		case TracksActionTypes.TogglePlayRandomly: {
			const updatedPlayRandomly = !state.playRandomly;
			const { currentTrack, nextTrack, prevTrack } = getCurrentTracks(
				state.currentTrack,
				state.queue,
				state.queueOrder,
			);

			return {
				...state,
				playRandomly: updatedPlayRandomly,
				previousTrack: prevTrack,
				currentTrack: currentTrack,
				nextTrack: nextTrack,
			};
		}
		case TracksActionTypes.ToggleRepeatQueue: {
			return {
				...state,
				repeatQueue: !state.repeatQueue,
			};
		}
		default:
			return state;
	}
};

export const TracksContext = React.createContext<{
	tracksState: TracksState;
	dispatchTracks: React.Dispatch<TracksActions>;
}>({
	tracksState: initialState,
	dispatchTracks: () => null,
});

const TracksContextProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	console.log(state.queueOrder);

	useEffect(() => {
		if (state.currentTrack) {
			const startSong = async (trackId: string) => {
				try {
					const actuallyPlayingTrackId = await TrackPlayer.getCurrentTrack();
					const newTrack = await TrackPlayer.getTrack(trackId);
					if (!newTrack) {
						throw new Error(`Unable to play the song "${trackId}"`);
					}
					if (actuallyPlayingTrackId !== trackId) {
						await TrackPlayer.skip(trackId);
					}
					await TrackPlayer.play();
				} catch (err) {
					dispatch({
						type: TracksActionTypes.UpdateQueue,
						payload: { remove: [trackId] },
					});
					TrackPlayer.remove(([trackId] as unknown) as Track).catch(
						(removeErr) => {
							/* nothing more can be done except we could reset queue */
							console.log(
								'[CurrentTrackChanged] - error - [TrackPlayer.remove] - error:\n ',
								trackId,
								'\n',
								removeErr,
							);
						},
					);
					console.log('[CurrentTrackChanged] error: ', err);
					showToast(
						`Current track changed, fail to skip to it. (${state.currentTrack})`,
						err.message,
					);
				}
			};

			startSong(state.currentTrack.path!);
		}
	}, [state.currentTrack]);

	useEffect(() => {
		dispatch({
			type: TracksActionTypes.UpdateQueueOrder,
		});
	}, [state.playRandomly]);

	useTrackPlayerEvents([Event.PlaybackQueueEnded], async () => {
		if (state.repeatQueue && state.nextTrack) {
			try {
				// @improvement - check if queue is not empty on the TrackPlayer if is set the queue from the state.
				await TrackPlayer.skip(state.nextTrack.path!);
				console.timeLog('start the queue after the it ended');
			} catch (err) {
				// @improvement clear the state queue or do @improvement from try here so we don't have to check there if the
				//	the track queue is not empty
				if (__DEV__) {
					showToast('Queue ended, fail to skip to next song.', err.message);
				}
			}
		}
	});

	return (
		<TracksContext.Provider value={{ tracksState: state, dispatchTracks: dispatch }}>
			{children}
		</TracksContext.Provider>
	);
};

export default TracksContextProvider;
