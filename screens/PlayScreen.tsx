import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import {
	View,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	Alert,
} from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import TrackPlayerProgress from '../components/TrackPlayerProgress/TrackPlayerProgress';
import Button from '../components/UI/Button';
import { RootStackParamList } from '../navigation/types/RootStackTypes';
import { View as ThemedView, Text } from '../components/UI/Themed';
import useIsPlaying from '../hooks/useIsPlaying';
import { TracksActionTypes, TracksContext } from '../context/tracksContext';
import Layout from '../constants/Layout';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const PlayScreen: React.FC<Props> = ({ navigation }) => {
	const isPlaying = useIsPlaying();
	const { tracksState, dispatchTracks } = useContext(TracksContext);

	const mainButtonPressHandler = () => {
		if (!isPlaying) {
			TrackPlayer.play();
		} else {
			TrackPlayer.pause();
		}
	};

	const queueItemPressHandler = async (track: Track) => {
		if (track.id === tracksState.currentTruck?.id) {
			return;
		}
		try {
			await TrackPlayer.skip(track.id);
			// await TrackPlayer.play();
			dispatchTracks({ type: TracksActionTypes.SetCurrentTrack, payload: track });
		} catch (err) {
			Alert.alert('', "Sorry couldn't play the song.");
			console.log('queueItemPressHandler err', err);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<Text>{new Date().toLocaleString('en-US')}</Text>
			<Button
				onPress={() => navigation.navigate('Directories')}
				title="Add Songs"
			/>
			<Button
				onPress={mainButtonPressHandler}
				title={isPlaying ? 'Pause' : 'Play'}
			/>
			<View style={styles.soundPlayerWrapper}>
				<Text>
					{tracksState.currentTruck ? tracksState.currentTruck.title : '-'}
				</Text>
				<TrackPlayerProgress />
			</View>
			<View>
				<Button
					title="show queue"
					onPress={() =>
						TrackPlayer.getQueue().then((_queue) => {
							dispatchTracks({
								type: TracksActionTypes.SetQueue,
								payload: _queue,
							});
						})
					}
				/>
				<Button
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
			<ScrollView>
				{true /*isPlayerInitialized*/ ? (
					<>
						<Text>Tracks in queue: {tracksState.queue.length}</Text>
						{tracksState.queue.map((track) => {
							return (
								<TouchableOpacity
									key={track.id}
									onPress={() => queueItemPressHandler(track)}>
									<View
										style={[
											{
												flexDirection: 'column',
												margin: 4,
												borderWidth: 1,
											},
										]}>
										<Text
											style={[
												{
													fontSize: 12,
												},
												track.id === tracksState.currentTruck?.id
													? {
															color: 'yellow',
													  }
													: {},
											]}>
											{track.title}
										</Text>
										<Text style={{ fontSize: 8 }}>
											{track.duration}
										</Text>
									</View>
								</TouchableOpacity>
							);
						})}
					</>
				) : (
					<ActivityIndicator />
				)}
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	soundPlayerWrapper: {
		marginVertical: Layout.spacing(2),
		marginHorizontal: Layout.spacing(2),
		paddingHorizontal: Layout.spacing(2),
		borderColor: 'lightblue',
		borderWidth: 1,
		borderStyle: 'dashed',
	},
	flatListTitle: {
		fontSize: Layout.spacing(3),
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
export default PlayScreen;
