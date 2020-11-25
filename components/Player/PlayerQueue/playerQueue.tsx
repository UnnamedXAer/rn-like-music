import React from 'react';
import {
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
	View,
} from 'react-native';
import { Track } from 'react-native-track-player';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../constants/Colors';
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
		<View style={styles.container}>
			{queue.length > 0 ? (
				<ScrollView style={styles.list}>
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
			) : (
				<View style={styles.notTracksContainer}>
					<FontAwesome5Icon
						name="music"
						color={Colors.colors.normal}
						size={55}
					/>
				</View>
			)}
			<ThemedText style={styles.listInfo}>
				Tracks in queue: {queue.length}
			</ThemedText>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	list: {
		flex: 1,
	},
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
	notTracksContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default PlayerQueue;
