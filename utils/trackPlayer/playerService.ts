import TrackPlayer, { Event } from 'react-native-track-player';
import * as PlayerActions from '../../store/player/actions';
import store from '../../store/store';

const { dispatch } = store;

export default async function playerServiceHandler() {
	TrackPlayer.addEventListener(Event.RemotePlay, () => {
		dispatch<any>(PlayerActions.togglePlay());
	});

	TrackPlayer.addEventListener(Event.RemotePause, () => {
		dispatch(PlayerActions.togglePlay() as any);
	});

	TrackPlayer.addEventListener(Event.RemoteStop, async () => {
		dispatch<any>(PlayerActions.stopPlayer());
	});

	TrackPlayer.addEventListener(Event.RemoteNext, () => {
		dispatch(PlayerActions.skipTrack('next') as any);
	});

	TrackPlayer.addEventListener(Event.RemotePrevious, () => {
		dispatch(PlayerActions.skipTrack('previous') as any);
	});

	TrackPlayer.addEventListener(Event.PlaybackError, (ev) => {
		console.log('--------------------PLAYBACK ERROR----------------------------');
		console.error(ev);
	});
	console.log('Player Service Handler - Done!');
}
