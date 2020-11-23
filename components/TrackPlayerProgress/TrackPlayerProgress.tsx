import React from 'react';
import { useProgress } from 'react-native-track-player';
import { StyleSheet, View } from 'react-native';
import { Text } from '../UI/Themed';
import Layout from '../../constants/Layout';
import { Slider } from '@miblanchard/react-native-slider';
import { secondsToMinutesString } from '../../utils/time';

interface Props {
	disabled: boolean;
}

const TrackPlayerProgress: React.FC<Props> = ({ disabled }) => {
	const progress = useProgress();
	return (
		<View style={styles.container}>
			<View>
				<Slider
					value={progress.position}
					maximumValue={progress.duration}
					disabled={disabled}
				/>
			</View>
			<View style={styles.timesContainer}>
				<Text>{disabled ? '' : secondsToMinutesString(progress.position)}</Text>
				<Text>{disabled ? '' : secondsToMinutesString(progress.duration)}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		paddingBottom: Layout.spacing(),
	},
	timesContainer: {
		bottom: 0,
		left: 0,
		right: 0,
		position: 'absolute',
		paddingHorizontal: Layout.spacing(1),
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});
export default TrackPlayerProgress;
