import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import Button from '../components/UI/Button';
import { RootStackParamList } from '../navigation/types/RootStackTypes';
import { View as ThemedView } from '../components/UI/Themed';
import { TracksActionTypes, TracksContext } from '../context/tracksContext';
import PlayerQueue from '../components/Player/PlayerQueue/playerQueue';
import { PlayerContext } from '../context/playerContext';
import PlayerCurrentSongState from '../components/Player/PlayerCurrentSongState/playerCurrentSongState';
import PlayerMainButton from '../components/Player/PlayerMainButton/playerMainButton';
import PlayerMainSkipButton from '../components/Player/PlayerMainSkipButton/playerMainSkipButton';
import PlayerSkipButtonSongName from '../components/Player/PlayerMainSkipButton/PlayerSkipButtonSongName/playerSkipButtonSongName';
import PlayerActions from '../components/PlayerActions/playerActions';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const PlayScreen: React.FC<Props> = ({ navigation }) => {
	const { error, isPlaying } = useContext(PlayerContext);
	const { tracksState, dispatchTracks } = useContext(TracksContext);

	useEffect(() => {
		ToastAndroid.show('Internal player error occurred.', ToastAndroid.LONG);
		console.log('Player error', error);
	}, [error]);

	const updateSongList = useCallback(() => {
		console.log('updating list');
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

	const queueItemPressHandler = async (track: Track) => {
		if (track.id === tracksState.currentTrack?.id) {
			return;
		}
		try {
			await TrackPlayer.skip(track.id);
			if (!isPlaying) {
				await TrackPlayer.play();
			}
		} catch (err) {
			ToastAndroid.show("Sorry couldn't play the song.", ToastAndroid.SHORT);
			console.log('queueItemPressHandler err', err);
		}
	};

	return (
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
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
export default PlayScreen;
