import { Track, TrackType } from 'react-native-track-player';
import Dir from '../models/dir';

export const mapSelectedFilesToTracks = (selectedFiles: { [path: string]: Dir }) => {
	const dirs = Object.values(selectedFiles);
	const tracks = mapDirsToTracks(dirs);
	return tracks;
};

export const mapDirsToTracks = (dirs: Dir[]) =>
	dirs.map(
		(dir) =>
			({
				url: 'file://' + dir.path,
				title: dir.name,
				id: dir.path,
				type: TrackType.Default,
				artist: 'artist: ' + dir.name,
			} as Track),
	);
