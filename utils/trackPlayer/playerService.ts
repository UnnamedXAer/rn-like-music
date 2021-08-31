import TrackPlayer, { Event, Track } from 'react-native-track-player';
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

	TrackPlayer.addEventListener(
		Event.PlaybackTrackChanged,
		(ev: {
			nextTrack: null | Track['id'];
			track: null | Track['id'];
			position: number;
		}) => {
			// console.log('[playbackTrackChanged]', Object.keys(ev));
			const currentTrack = store.getState().player.currentTrack;
			console.log('[playbackTrackChanged].next', ev.nextTrack);
			console.log('[playbackTrackChanged].track', ev.track);
			console.log('[playbackTrackChanged] - currentTrack', currentTrack?.name);

			if (currentTrack !== null) {
				if (ev.nextTrack !== null && currentTrack.path !== ev.nextTrack) {
					console.log('dispatching [skipTrack]');
					store.dispatch<any>(PlayerActions.skipTrack('next'));
				}
			}
		},
	);

	TrackPlayer.addEventListener(
		Event.PlaybackQueueEnded,
		async (ev: {
			nextTrack: null | Track['id'];
			track: null | Track['id'];
			position: number;
		}) => {
			console.log('[PlaybackQueueEnded] - ev', ev);
			const repeat = store.getState().player.repeat;
			const queue = store.getState().queue;
			if (
				repeat === true &&
				queue.tracks.length > 0 &&
				(await TrackPlayer.getQueue()).length > 0
			) {
				store.dispatch<any>(PlayerActions.skipTrack('next'));
			}
		},
	);

	console.log('Player Service Handler - Done!');
}
