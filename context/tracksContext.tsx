import React, { useReducer } from 'react';
import { Track } from 'react-native-track-player';

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
	currentTruck: Track | null;
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
	currentTruck: null,
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
	console.log('action', action.type);
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
			return { ...state, currentTruck: action.payload };
		case TracksActionTypes.ResetQueue:
			return { ...state, queue: [], currentTruck: null };
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

const TracksProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<TracksContext.Provider value={{ tracksState: state, dispatchTracks: dispatch }}>
			{children}
		</TracksContext.Provider>
	);
};

export default TracksProvider;
