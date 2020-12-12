import { Track, TrackType } from 'react-native-track-player';
import Playable from '../../models/playable';

export const mapPlayableToTracks = async (songs: Playable[]) =>
	songs.map(
		(song) =>
			({
				url: 'file://' + song.path,
				title: song.name,
				id: song.path,
				type: TrackType.Default,
				artist: 'artist: ' + song.name,
			} as Track),
	);
