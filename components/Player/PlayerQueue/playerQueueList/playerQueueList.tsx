import React from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import Playable from '../../../../models/playable';
import PlayerQueueListEmptyComponent from './playerQueueListEmptyComponent';
import PlayerQueueListItem from './playerQueueListItem';

interface Props {
	playables: Playable[];
	currentTrackPath: string | undefined;
	onSongLongPress: (playable: Playable) => void;
	onSongPress: (playable: Playable) => void;
	onNoSongPress: () => void;
}

const PlayerQueueList = ({
	playables,
	currentTrackPath,
	onSongLongPress,
	onSongPress,
	onNoSongPress,
}: Props) => {
	const renderItem: ListRenderItem<Playable> = ({ item }) => (
		<PlayerQueueListItem
			currentTrackPath={currentTrackPath}
			playable={item}
			onSongLongPress={() => onSongLongPress(item)}
			onSongPress={() => onSongPress(item)}
		/>
	);

	return (
		<FlatList
			style={styles.list}
			data={playables}
			keyExtractor={({ path }) => path}
			renderItem={renderItem}
			contentContainerStyle={styles.listContentContainerStyle}
			ListEmptyComponent={
				<PlayerQueueListEmptyComponent onPress={() => onNoSongPress()} />
			}
		/>
	);
};

const styles = StyleSheet.create({
	list: {
		flex: 1,
		elevation: 2,
	},
	listContentContainerStyle: {
		flexGrow: 1,
	},
});

export default PlayerQueueList;
