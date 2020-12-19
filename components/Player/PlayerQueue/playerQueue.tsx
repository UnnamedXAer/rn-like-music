import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Layout from '../../../constants/Layout';
import Dir from '../../../models/dir';
import { Text as ThemedText } from '../../UI/Themed';
import PlayerQueueList from './playerQueueList/playerQueueList';

interface Props {
	queue: Dir[];
	onSongPress: (track: Dir) => Promise<void>;
	onSongLongPress: (track: Dir) => Promise<void>;
	onNoSongPress: () => void;
	currentTrackId: Dir['path'] | undefined;
	loading: boolean;
}

const PlayerQueue: React.FC<Props> = ({
	currentTrackId: currentTrackPath,
	queue,
	onSongPress,
	onSongLongPress,
	onNoSongPress,
	loading,
}) => {
	return loading ? (
		<ActivityIndicator />
	) : (
		<View style={styles.container}>
			<PlayerQueueList
				playables={queue}
				onSongPress={onSongPress}
				onSongLongPress={onSongLongPress}
				onNoSongPress={onNoSongPress}
				currentTrackPath={currentTrackPath}
			/>
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
		elevation: 2,
	},
	listInfo: {
		fontStyle: 'italic',
		textAlign: 'right',
		marginHorizontal: Layout.spacing(1),
		marginVertical: Layout.spacing(0.5),
		fontSize: 12,
	},
});

export default PlayerQueue;
