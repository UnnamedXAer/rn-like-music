import { ToastAndroid } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import Dir from '../models/dir';

export const playTrack = async (
	dir: Dir,
	currentTrack: Dir | null = null,
	isPlaying: boolean = false,
) => {
	try {
		if (dir.path === currentTrack?.path) {
			if (isPlaying === false) {
				await TrackPlayer.play();
			}
			return await TrackPlayer.seekTo(0);
		}
		await TrackPlayer.skip(dir.path);
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
