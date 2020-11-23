import { ToastAndroid } from 'react-native';
import { Track } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';

export const playTrack = async (
	track: Track,
	currentTrack: Track | null = null,
	isPlaying: boolean = false,
) => {
	try {
		if (track.id === currentTrack?.id) {
			if (isPlaying === false) {
				await TrackPlayer.play();
			}
			return await TrackPlayer.seekTo(0);
		}
		await TrackPlayer.skip(track.id);
		if (!isPlaying) {
			await TrackPlayer.play();
		}
	} catch (err) {
		ToastAndroid.show(
			"Sorry couldn't play the song." + (__DEV__ ? err.message : ''),
			ToastAndroid.SHORT,
		);
		console.log('=> playTrack err', err);
	}
};
