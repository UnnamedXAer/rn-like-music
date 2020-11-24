import React, { useState } from 'react';
import { Event, State, useTrackPlayerEvents } from 'react-native-track-player';
import { INTERNAL_ERROR_MSG } from '../constants/strings';
import { StateError } from '../types/reactTypes';
import showToast from '../utils/showToast';

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
	useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackError], (ev) => {
		if (ev.state === State.Playing) {
			console.log('playing state changed: ', ev);
		}
		setIsPlaying(ev.state === State.Playing);
		if (ev.type === Event.PlaybackError) {
			setError(ev.type);
			showToast(INTERNAL_ERROR_MSG, JSON.stringify(ev, null, 2));
			console.log('IMPORTANT --------------- > Player error', ev);
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
