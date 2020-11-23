import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import { TracksState } from '../../../context/tracksContext';
import TrackPlayerProgress from '../../TrackPlayerProgress/TrackPlayerProgress';
import { Text } from '../../UI/Themed';

interface Props {
	currentTrack: TracksState['currentTrack'];
}

const PlayerCurrentSongState: React.FC<Props> = ({ currentTrack }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={
					currentTrack
						? () => ToastAndroid.show(currentTrack.title!, ToastAndroid.SHORT)
						: undefined
				}>
				<Text style={styles.songTitle} numberOfLines={2}>
					{currentTrack ? currentTrack.title : '- - -'}
				</Text>
			</TouchableOpacity>
			<TrackPlayerProgress disabled={currentTrack === null} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 2,
		borderTopColor: Colors.colors.normal,
		marginVertical: Layout.spacing(2),
		marginHorizontal: Layout.spacing(2),
		paddingTop: Layout.spacing(),
		paddingHorizontal: Layout.spacing(2),
	},
	songTitle: {
		fontSize: Layout.spacing(
			Layout.deviceSize === 'tablet' ? 3 : Layout.deviceSize === 'small' ? 1.5 : 2,
		),
		textAlign: 'center',
		fontWeight: 'bold',
		fontStyle: 'italic',
	},
});

export default PlayerCurrentSongState;
