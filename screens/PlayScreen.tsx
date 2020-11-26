import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import { RootStackParamList } from '../navigation/types/RootStackNavigatorTypes';
import { View as ThemedView } from '../components/UI/Themed';
import { TracksActionTypes, TracksContext } from '../context/tracksContext';
import PlayerQueue from '../components/Player/PlayerQueue/playerQueue';
import { PlayerContext } from '../context/playerContext';
import PlayerCurrentSongState from '../components/Player/PlayerCurrentSongState/playerCurrentSongState';
import PlayerActions from '../components/PlayerActions/playerActions';
import { SkipSong } from '../components/Player/PlayerMainSkipButton/playerMainSkipButton';
import QueueSongMenu, {
	QueueSongOptionsOption,
} from '../components/Player/QueueSongMenu/queueSongMenu';
import assertUnreachable from '../utils/assertUnreachable';
import { getDirInfo } from '../utils/storage/externalStorage';
import { playTrack } from '../trackPlayer/playerUtils';
import { RouteProp } from '@react-navigation/native';
import showToast from '../utils/showToast';
import { INTERNAL_ERROR_MSG } from '../constants/strings';
import Layout from '../constants/Layout';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

type PlayScreenRouteProp = RouteProp<RootStackParamList, 'Play'>;
interface Props {
	navigation: ScreenNavigationProp;
	route: PlayScreenRouteProp;
}

const PlayScreen: React.FC<Props> = () => {
	const { isPlaying } = useContext(PlayerContext);
	const { tracksState, dispatchTracks } = useContext(TracksContext);
	const [longPressedSong, setLongPressedSong] = useState<Track | null>(null);

	const updateSongList = useCallback(() => {
		TrackPlayer.getQueue().then((_queue) => {
			dispatchTracks({
				type: TracksActionTypes.SetQueue,
				payload: _queue,
			});
		});
	}, [dispatchTracks]);

	useEffect(() => {
		updateSongList();
	}, [updateSongList]);

	const mainButtonPressHandler = () => {
		if (!isPlaying) {
			TrackPlayer.play();
		} else {
			TrackPlayer.pause();
		}
	};

	const skipSongHandler: SkipSong = async (direction) => {
		try {
			if (direction === 'next') {
				if (tracksState.nextTrack) {
					return await playTrack(
						tracksState.nextTrack,
						tracksState.currentTrack,
						isPlaying,
					);
				}
				showToast('There is no next track.');
			}
			if (tracksState.previousTrack) {
				return await playTrack(
					tracksState.previousTrack,
					tracksState.currentTrack,
					isPlaying,
				);
			}
			showToast('There is no previous track.');
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
	};

	const queueItemPressHandler = (track: Track) => {
		return playTrack(track, tracksState.currentTrack, isPlaying);
	};

	const queueItemLongPressHandler = async (track: Track) => {
		setLongPressedSong(track);
	};
	const queueMenuItemPressHandler = async (option: QueueSongOptionsOption) => {
		if (longPressedSong === null) {
			return showToast(INTERNAL_ERROR_MSG, 'Value of longPressedSong is null');
		}

		try {
			switch (option) {
				case 'PLAY':
					playTrack(longPressedSong, tracksState.currentTrack, isPlaying);
					break;
				case 'REMOVE_FROM_QUEUE':
					await TrackPlayer.remove(longPressedSong);
					break;
				case 'SHOW_INFO':
					const info = await getDirInfo(longPressedSong.id);
					Alert.alert(JSON.stringify(info, null, '\t'));
					break;
				default:
					assertUnreachable(option);
			}
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
		setLongPressedSong(null);
	};

	const songSeekHandler = async (position: number) => {
		try {
			await TrackPlayer.seekTo(position);
			if (isPlaying === false) {
				await TrackPlayer.play();
			}
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
	};

	return (
		<>
			<ThemedView style={styles.container}>
				<PlayerQueue
					queue={tracksState.queue}
					currentTrackId={tracksState.currentTrack?.id}
					loading={false}
					onSongPress={queueItemPressHandler}
					onSongLongPress={queueItemLongPressHandler}
				/>
				<PlayerCurrentSongState
					currentTrack={tracksState.currentTrack}
					onSeek={songSeekHandler}
				/>
				<PlayerActions
					mainButtonAction={isPlaying ? 'pause' : 'play'}
					mainButtonPressHandler={mainButtonPressHandler}
					nextTrack={tracksState.nextTrack}
					previousTrack={tracksState.previousTrack}
					skipSong={skipSongHandler}
				/>
			</ThemedView>
			<QueueSongMenu
				onItemPress={queueMenuItemPressHandler}
				onPressOutside={() => setLongPressedSong(null)}
				visible={longPressedSong !== null}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: Layout.spacing(
			Layout.deviceSize === 'tablet' ? 3 : Layout.deviceSize === 'large' ? 2 : 1,
		),
	},
});
export default PlayScreen;
