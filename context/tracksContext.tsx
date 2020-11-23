import React, { useReducer } from 'react';
import TrackPlayer, {
	Event,
	Track,
	useTrackPlayerEvents,
} from 'react-native-track-player';

type ActionMap<M extends { [key: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key;
		  }
		: {
				type: Key;
				payload: M[Key];
		  };
};

export type TracksState = {
	queue: Track[];
	currentTrack: Track | null;
	nextTrack: Track | null;
	previousTrack: Track | null;
};

export enum TracksActionTypes {
	AddToQueue = 'ADD_TO_QUEUE',
	SetQueue = 'SET_QUEUE',
	RemoveFromQueue = 'REMOVE_FROM_QUEUE',
	ResetQueue = 'RESET_QUEUE',
	SetCurrentTrack = 'SET_CURRENT_TRACK',
}

const initialState: TracksState = {
	queue: [],
	currentTrack: null,
	nextTrack: null,
	previousTrack: null,
};

type ActionPayload = {
	[TracksActionTypes.AddToQueue]: Track[];
	[TracksActionTypes.SetQueue]: Track[];
	[TracksActionTypes.RemoveFromQueue]: Track['id'][] | Track['id'];
	[TracksActionTypes.SetCurrentTrack]: Track | null;
	[TracksActionTypes.ResetQueue]: undefined;
};

type TracksActions = ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>];

const reducer = (state: TracksState, action: TracksActions): TracksState => {
	switch (action.type) {
		case TracksActionTypes.AddToQueue:
			const updatedQueue = [...state.queue];
			updatedQueue.push(...action.payload);
			return {
				...state,
				queue: updatedQueue,
			};
		case TracksActionTypes.SetQueue:
			return {
				...state,
				queue: action.payload,
			};
		case TracksActionTypes.RemoveFromQueue:
			let updatedQueueR: Track[];
			if (typeof action.payload === 'string') {
				updatedQueueR = state.queue.filter((x) => x.id !== action.payload);
			} else {
				updatedQueueR = state.queue.filter((x) => !action.payload.includes(x.id));
			}
			return {
				...state,
				queue: updatedQueueR,
			};
		case TracksActionTypes.SetCurrentTrack:
			const currentTrack: Track | null = action.payload
				? { ...action.payload }
				: null;
			let nextTrack: Track | null = null;
			let prevTrack: Track | null = null;
			if (currentTrack !== null && state.queue.length > 0) {
				const currTrackIdx = state.queue.findIndex(
					(x) => x.id === currentTrack.id,
				);
				nextTrack =
					state.queue[
						currTrackIdx === state.queue.length - 1 ? 0 : currTrackIdx + 1
					];
				prevTrack =
					state.queue[
						currTrackIdx === 0 ? state.queue.length - 1 : currTrackIdx - 1
					];
			}
			return {
				...state,
				currentTrack: currentTrack,
				nextTrack: nextTrack,
				previousTrack: prevTrack,
			};

		case TracksActionTypes.ResetQueue:
			return { ...state, queue: [], currentTrack: null };
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

	useTrackPlayerEvents([Event.PlaybackTrackChanged], () => {
		TrackPlayer.getCurrentTrack().then((trackId) => {
			const track = state.queue.find((x) => x.id === trackId);
			dispatch({
				type: TracksActionTypes.SetCurrentTrack,
				payload: track || null,
			});
		});
	});

	return (
		<TracksContext.Provider value={{ tracksState: state, dispatchTracks: dispatch }}>
			{children}
		</TracksContext.Provider>
	);
};

export default TracksContextProvider;
