import React from 'react';
import { StyleSheet, View } from 'react-native';
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
			<Text>{currentTrack ? currentTrack.title : '-'}</Text>
			<TrackPlayerProgress disabled={currentTrack === null} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: Layout.spacing(2),
		marginHorizontal: Layout.spacing(2),
		paddingHorizontal: Layout.spacing(2),
		borderColor: 'lightblue',
		borderWidth: 1,
		borderStyle: 'dashed',
	},
});

export default PlayerCurrentSongState;
