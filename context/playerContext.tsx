import React, { useState } from 'react';
import { Event, State, useTrackPlayerEvents } from 'react-native-track-player';
import { StateError } from '../types/reactTypes';

type PlayerContextState = {
	isPlaying: boolean;
	error: StateError;
};

const initialState: PlayerContextState = {
	isPlaying: false,
	error: null,
};

export const PlayerContext = React.createContext<PlayerContextState>(initialState);

const PlayerContextProvider: React.FC = ({ children }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<StateError>(null);
	console.log('TracksContext - isPlaying -> ', isPlaying);
	useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackError], (ev) => {
		console.log('-> PlayerContext -> useTrackPlayerEvents ev: ', JSON.stringify(ev));
		if (ev.state === State.Playing) {
			console.log(ev.state);
		}
		setIsPlaying(ev.state === State.Playing);
		if (ev.type === Event.PlaybackError) {
			setError(error);
		} else if (error !== null) {
			setError(null);
		}
	});

	return (
		<PlayerContext.Provider value={{ isPlaying, error }}>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
