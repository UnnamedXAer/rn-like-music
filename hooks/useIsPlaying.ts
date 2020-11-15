import { useState } from 'react';
import { Event, State, useTrackPlayerEvents } from 'react-native-track-player';

export default () => {
	const [isPlaying, setIsPlaying] = useState(false);

	useTrackPlayerEvents([Event.PlaybackState], (ev) => {
		if (ev.state === State.Playing) {
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
		}
	});

	return isPlaying;
};
