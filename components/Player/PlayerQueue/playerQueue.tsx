import React from 'react';
import {
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
	View,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import Dir from '../../../models/dir';
import Separator from '../../UI/Separator';
import { Text as ThemedText } from '../../UI/Themed';

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
			{queue.length > 0 ? (
				<ScrollView style={styles.list}>
					{queue.map((dir) => {
						return (
							<React.Fragment key={dir.path}>
								<TouchableOpacity
									onPress={() => onSongPress(dir)}
									onLongPress={() => onSongLongPress(dir)}
									style={styles.trackContainer}>
									<ThemedText
										style={[
											styles.trackTitle,
											{
												fontWeight:
													dir.path === currentTrackPath
														? '700'
														: 'normal',
											},
										]}>
										{dir.name}
									</ThemedText>
								</TouchableOpacity>
								<Separator separatorStyle={styles.songSeparator} />
							</React.Fragment>
						);
					})}
				</ScrollView>
			) : (
				<TouchableOpacity
					style={styles.notTracksContainer}
					onPress={onNoSongPress}>
					<FontAwesome5Icon
						name="music"
						color={Colors.colors.normal}
						size={55}
					/>
				</TouchableOpacity>
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
		elevation: 2,
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
		fontSize: Layout.deviceSize === 'tablet' ? 20 : 14,
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
