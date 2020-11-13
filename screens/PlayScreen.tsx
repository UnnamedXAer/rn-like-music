import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	Button,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import TrackPlayer, {
	Event,
	State,
	Track,
	useTrackPlayerEvents,
} from 'react-native-track-player';
import TrackPlayerProgress from '../components/TrackPlayerProgress/TrackPlayerProgress';
import { RootStackParamList } from '../navigation/types/RootStack';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const PlayScreen: React.FC<Props> = ({ navigation }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [queue, setQueue] = useState<Track[]>([]);

	console.log('queue', queue);

	useTrackPlayerEvents([Event.PlaybackState], (ev) => {
		console.log('ev.state', ev);
		if (ev.state === State.Playing) {
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
		}
	});

	const mainButtonPressHandler = () => {
		if (!isPlaying) {
			TrackPlayer.play();
			//setIsPlaying(true);
		} else {
			TrackPlayer.pause();
			//setIsPlaying(false);
		}
	};

	const queueItemPressHandler = async (track: Track) => {
		console.log('track', track);
		try {
			console.log('skipping to:', track.title);
			await TrackPlayer.skip(track.id);
			await TrackPlayer.play();
			console.log('track playing', track.title);
		} catch (err) {
			console.log('sound player err', err);
		}
	};

	// const readSongImg = async (path: string) => {
	// try {
	// 	const data = await readStorageFile(dir.path);
	// 	console.log('data', data.substr(0, 50));
	// 	// setCurrenFile(data);
	// } catch (err) {
	// 	setError(err.message);
	// }
	// };

	return (
		<View style={styles.container}>
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
				<TrackPlayerProgress />
			</View>
			<View>
				<Button
					title="show queue"
					onPress={() =>
						TrackPlayer.getQueue().then((_queue) => setQueue(_queue))
					}
				/>
				<Button
					title="Reset queue"
					onPress={() =>
						TrackPlayer.reset().then((res) => console.log('reset', res))
					}
				/>
			</View>
			<ScrollView
				// eslint-disable-next-line react-native/no-inline-styles
				style={{
					backgroundColor: '#eee',
				}}>
				{true /*isPlayerInitialized*/ ? (
					<>
						<Text>Tracks in queue: {queue.length}</Text>
						{queue.map((track) => (
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
									<Text style={{ fontSize: 12 }}>{track.title}</Text>
									<Text style={{ fontSize: 8 }}>{track.duration}</Text>
								</View>
							</TouchableOpacity>
						))}
					</>
				) : (
					<ActivityIndicator />
				)}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'red',
	},
	soundPlayerWrapper: {
		marginVertical: 16,
		marginHorizontal: 16,
		borderColor: 'lightblue',
		borderWidth: 1,
		borderStyle: 'dashed',
	},
	flatListTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
export default PlayScreen;
