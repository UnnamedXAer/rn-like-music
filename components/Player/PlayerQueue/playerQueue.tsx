import React from 'react';
import {
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { Track } from 'react-native-track-player';
import Layout from '../../../constants/Layout';
import Separator from '../../UI/Separator';
import { Text as ThemedText } from '../../UI/Themed';

interface Props {
	queue: Track[];
	onSongPress: (track: Track) => Promise<void>;
	currentTrackId: Track['id'] | undefined;
	loading: boolean;
}

const PlayerQueue: React.FC<Props> = ({
	currentTrackId,
	queue,
	onSongPress: songPressHandler,
	loading,
}) => {
	return loading ? (
		<ActivityIndicator />
	) : (
		<>
			<ThemedText style={styles.listInfo}>
				Tracks in queue: {queue.length}
			</ThemedText>
			<ScrollView>
				{queue.map((track) => {
					return (
						<TouchableOpacity
							key={track.id}
							onPress={() => songPressHandler(track)}
							style={styles.trackContainer}>
							<ThemedText
								style={[
									styles.trackTitle,
									{
										fontWeight:
											track.id === currentTrackId
												? '700'
												: 'normal',
									},
								]}>
								{track.title}
							</ThemedText>
							<Separator separatorStyle={styles.songSeparator} />
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	listInfo: {
		fontStyle: 'italic',
		marginHorizontal: Layout.spacing(1),
		marginBottom: Layout.spacing(0.5),
	},
	trackContainer: {
		flexDirection: 'column',
		marginHorizontal: Layout.spacing(
			Layout.deviceSize === 'medium' ? 1.5 : Layout.deviceSize === 'tablet' ? 3 : 1,
		),
		marginVertical: Layout.spacing(0.5),
		// borderWidth: 1,
	},
	trackTitle: {
		fontSize: 14,
	},
	songSeparator: {
		alignSelf: 'center',
	},
});

export default PlayerQueue;
