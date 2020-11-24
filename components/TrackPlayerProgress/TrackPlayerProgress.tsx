import React, { useEffect, useState } from 'react';
import { useProgress } from 'react-native-track-player';
import { StyleSheet, View } from 'react-native';
import { Text } from '../UI/Themed';
import Layout from '../../constants/Layout';
import { Slider, SliderOnChangeCallback } from '@miblanchard/react-native-slider';
import { secondsToMinutesString } from '../../utils/time';

interface Props {
	disabled: boolean;
	onSeekComplete: (position: number) => Promise<void>;
}

const TrackPlayerProgress: React.FC<Props> = ({ disabled, onSeekComplete }) => {
	const [value, setValue] = useState(0);
	const [trackDuration, setTrackDuration] = useState(0);
	const [isSliding, setIsSliding] = useState(false);
	const progress = useProgress(250);

	useEffect(() => {
		if (isSliding === false && trackDuration !== progress.duration) {
			setTrackDuration(progress.duration);
		}
	}, [trackDuration, isSliding, progress.duration]);

	useEffect(() => {
		if (isSliding === false) {
			setValue(progress.position);
		}
	}, [isSliding, progress.position]);

	const slidingCompleteHandler: SliderOnChangeCallback = async (slideValue) => {
		const sliderPosition = slideValue[0];
		console.log('seek to: ', secondsToMinutesString(sliderPosition));
		onSeekComplete(sliderPosition);
		setTimeout(() => {
			// keep slider from jumping to start position
			setIsSliding(false);
			setValue(sliderPosition);
		}, 501);
	};

	return (
		<View style={styles.container}>
			<View>
				<Slider
					value={value}
					minimumValue={0}
					maximumValue={trackDuration}
					disabled={disabled}
					onSlidingStart={() => {
						setIsSliding(true);
					}}
					onValueChange={(slideValue) => setValue(slideValue[0])}
					onSlidingComplete={slidingCompleteHandler}
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
