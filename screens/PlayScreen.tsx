import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
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
import { RouteProp } from '@react-navigation/native';
import showToast from '../utils/showToast';
import { INTERNAL_ERROR_MSG } from '../constants/strings';
import Layout from '../constants/Layout';
import { PlayerAdditionalPropAction } from '../components/Player/PlayerAdditionalActionButton/PlayerAdditionalActionButton';
import Dir from '../models/dir';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

type PlayScreenRouteProp = RouteProp<RootStackParamList, 'Play'>;
interface Props {
	navigation: ScreenNavigationProp;
	route: PlayScreenRouteProp;
}

const PlayScreen: React.FC<Props> = ({ navigation }) => {
	const { isPlaying } = useContext(PlayerContext);
	const { tracksState, dispatchTracks } = useContext(TracksContext);
	const [longPressedSong, setLongPressedSong] = useState<Dir | null>(null);

	const playTrack = async (dir: Dir) => {
		dispatchTracks({
			type: TracksActionTypes.SetCurrentTrack,
			payload: dir,
		});
	};

	const mainButtonPressHandler = async () => {
		if (tracksState.currentTrack === null) {
			showToast("The queue is empty, let's add some songs.");
			navigation.navigate('Directories');
		}
		try {
			if (!isPlaying) {
				await TrackPlayer.play();
			} else {
				await TrackPlayer.pause();
			}
		} catch (err) {
			showToast(
				INTERNAL_ERROR_MSG,
				`Fail to ${isPlaying ? 'pause' : 'play'}.\n` + err.message,
			);
		}
	};

	const skipSongHandler: SkipSong = async (direction) => {
		try {
			if (direction === 'next') {
				if (tracksState.nextTrack) {
					return playTrack(tracksState.nextTrack);
				}
				showToast('There is no next song.');
			}
			if (tracksState.previousTrack) {
				return playTrack(tracksState.previousTrack);
			}
			showToast('There is no previous song.');
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
	};

	const queueItemPressHandler = (dir: Dir) => {
		return playTrack(dir);
	};

	const queueItemLongPressHandler = async (dir: Dir) => {
		setLongPressedSong(dir);
	};
	const queueMenuItemPressHandler = async (option: QueueSongOptionsOption) => {
		if (longPressedSong === null) {
			return showToast(INTERNAL_ERROR_MSG, 'Value of longPressedSong is null');
		}

		try {
			switch (option) {
				case 'PLAY':
					playTrack(longPressedSong);
					break;
				case 'REMOVE_FROM_QUEUE':
					try {
						const tract = await TrackPlayer.getTrack(longPressedSong.path);
						if (tract.id === tracksState.currentTrack?.path) {
							await TrackPlayer.stop();
							if (tracksState.nextTrack) {
								await TrackPlayer.skip(tracksState.nextTrack?.path);
							}
						}
						console.log('about to remove track: ', tract);
						await TrackPlayer.remove([(tract.id as unknown) as Track]);
						dispatchTracks({
							type: TracksActionTypes.UpdateQueue,
							payload: {
								remove: [longPressedSong.path],
							},
						});
						showToast('track removed', tract.title);
					} catch (err) {
						showToast(
							'Fail to remove track: ' + longPressedSong.name,
							err.message,
						);
					}
					break;
				case 'SHOW_INFO':
					const info = await getDirInfo(longPressedSong.path);
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

	const additionalPlayerPropActionHandler: PlayerAdditionalPropAction = (action) => {
		let dispatchActionType = TracksActionTypes.TogglePlayRandomly;
		if (action === 'repeat-queue') {
			dispatchActionType = TracksActionTypes.ToggleRepeatQueue;
		}
		dispatchTracks({ type: dispatchActionType });
	};

	return (
		<>
			<ThemedView style={styles.container}>
				<PlayerQueue
					queue={tracksState.queue}
					currentTrackId={tracksState.currentTrack?.path}
					loading={false}
					onSongPress={queueItemPressHandler}
					onSongLongPress={queueItemLongPressHandler}
					onNoSongPress={() => {
						navigation.navigate('Directories');
					}}
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
					playRandomly={tracksState.playRandomly}
					repeatQueue={tracksState.repeatQueue}
					additionalPlayerPropAction={additionalPlayerPropActionHandler}
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
