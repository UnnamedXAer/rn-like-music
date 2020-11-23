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
	onSongLongPress: (track: Track) => Promise<void>;
	currentTrackId: Track['id'] | undefined;
	loading: boolean;
}

const PlayerQueue: React.FC<Props> = ({
	currentTrackId,
	queue,
	onSongPress,
	onSongLongPress,
	loading,
}) => {
	return loading ? (
		<ActivityIndicator />
	) : (
		<>
			<ScrollView>
				{queue.map((track) => {
					return (
						<React.Fragment key={track.id}>
							<TouchableOpacity
								onPress={() => onSongPress(track)}
								onLongPress={() => onSongLongPress(track)}
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
							</TouchableOpacity>
							<Separator separatorStyle={styles.songSeparator} />
						</React.Fragment>
					);
				})}
			</ScrollView>
			<ThemedText style={styles.listInfo}>
				Tracks in queue: {queue.length}
			</ThemedText>
		</>
	);
};

const styles = StyleSheet.create({
	listInfo: {
		fontStyle: 'italic',
		textAlign: 'right',
		marginHorizontal: Layout.spacing(1),
		marginVertical: Layout.spacing(0.5),
		fontSize: 12,
	},
	trackContainer: {
		flexDirection: 'column',
		marginHorizontal: Layout.spacing(
			Layout.deviceSize === 'medium' ? 1.5 : Layout.deviceSize === 'tablet' ? 3 : 1,
		),
		marginVertical: Layout.spacing(0.5),
	},
	trackTitle: {
		fontSize: 14,
	},
	songSeparator: {
		alignSelf: 'center',
	},
});

export default PlayerQueue;
