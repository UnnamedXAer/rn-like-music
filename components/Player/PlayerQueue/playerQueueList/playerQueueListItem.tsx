import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Layout from '../../../../constants/Layout';
import Playable from '../../../../models/playable';
import MenuVerticalButton from '../../../UI/menuVerticalButton';
import Separator from '../../../UI/Separator';
import { Text as ThemedText } from '../../../UI/Themed';

interface Props {
	playable: Playable;
	currentTrackPath: string | undefined;
	onSongLongPress: () => void;
	onSongPress: () => void;
}

const PlayerQueueListItem = ({
	playable: dir,
	currentTrackPath,
	onSongLongPress,
	onSongPress,
}: Props) => {
	return (
		<React.Fragment key={dir.path}>
			<View style={styles.listItem}>
				<TouchableOpacity
					onPress={onSongPress}
					onLongPress={onSongLongPress}
					style={styles.touchable}>
					<ThemedText
						style={[
							styles.trackTitle,
							{
								fontWeight:
									dir.path === currentTrackPath ? '700' : 'normal',
							},
						]}>
						{dir.name}
					</ThemedText>
				</TouchableOpacity>
				<MenuVerticalButton onPress={onSongLongPress} />
			</View>
			<Separator separatorStyle={styles.songSeparator} />
		</React.Fragment>
	);
};

const styles = StyleSheet.create({
	listItem: {
		flex: 1,
		flexDirection: 'row',
	},
	touchable: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: Layout.spacing(
			Layout.deviceSize === 'medium' ? 1.5 : Layout.deviceSize === 'tablet' ? 3 : 1,
		),
	},
	trackTitle: {
		paddingVertical: Layout.spacing(1),
		flex: 1,
		fontSize: Layout.deviceSize === 'tablet' ? 20 : 14,
	},
	songSeparator: {
		alignSelf: 'center',
	},
});

export default PlayerQueueListItem;
