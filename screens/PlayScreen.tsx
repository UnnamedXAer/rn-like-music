import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import Button from '../components/UI/Button';
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

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

type PlayScreenRouteProp = RouteProp<RootStackParamList, 'Play'>;
interface Props {
	navigation: ScreenNavigationProp;
	route: PlayScreenRouteProp;
}

const PlayScreen: React.FC<Props> = ({ navigation }) => {
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

	return (
		<>
			<ThemedView style={styles.container}>
				<Button
					onPress={() => navigation.navigate('Directories')}
					title="Add Songs"
				/>
				<PlayerActions
					mainButtonAction={isPlaying ? 'pause' : 'play'}
					mainButtonPressHandler={mainButtonPressHandler}
					nextTrack={tracksState.nextTrack}
					previousTrack={tracksState.previousTrack}
					skipSong={skipSongHandler}
				/>
				<PlayerCurrentSongState currentTrack={tracksState.currentTrack} />
				<View>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<Button
							size="small"
							title="show queue"
							onPress={updateSongList}
							color="violet"
						/>
						<Button
							size="small"
							title="Reset queue"
							onPress={() =>
								TrackPlayer.reset().then(() =>
									dispatchTracks({
										type: TracksActionTypes.ResetQueue,
									}),
								)
							}
						/>
					</View>
				</View>
				<PlayerQueue
					queue={tracksState.queue}
					currentTrackId={tracksState.currentTrack?.id}
					loading={false}
					onSongPress={queueItemPressHandler}
					onSongLongPress={queueItemLongPressHandler}
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
	},
});
export default PlayScreen;
