import TrackPlayer, { Event } from 'react-native-track-player';

export default async function () {
	// This service needs to be registered for the module to work
	// but it will be used later in the "Receiving Events" section

	TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

	TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

	TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.destroy());

	console.log('player-service registered.');
}
