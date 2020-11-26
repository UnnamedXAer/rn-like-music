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
		onSeekComplete(sliderPosition);
		setTimeout(() => {
			// keep slider from jumping to start position
			setIsSliding(false);
			setValue(sliderPosition);
		}, 750);
	};

	return (
		<View style={styles.container}>
			<View style={styles.sliderContainer}>
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
						trackStyle={styles.trackStyle}
						thumbStyle={styles.thumbStyle}
					/>
				</View>
				<View style={styles.timesContainer}>
					<Text style={styles.timeText}>
						{disabled ? '' : secondsToMinutesString(progress.position)}
					</Text>
					<Text style={styles.timeText}>
						{disabled ? '' : secondsToMinutesString(progress.duration)}
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	sliderContainer: {
		paddingBottom: Layout.spacing(Layout.deviceSize === 'tablet' ? 3 : 1.5),
		position: 'relative',
		width: '100%',
		maxWidth: 500,
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
	timeText: {
		fontSize: Layout.spacing(Layout.deviceSize === 'tablet' ? 3 : 1.5),
	},
	thumbStyle: {
		height: Layout.spacing(Layout.deviceSize === 'tablet' ? 4 : 2),
		width: Layout.spacing(Layout.deviceSize === 'tablet' ? 4 : 2),
		borderRadius: Layout.spacing(Layout.deviceSize === 'tablet' ? 2 : 1),
	},
	trackStyle: {
		height: Layout.spacing(Layout.deviceSize === 'tablet' ? 1 : 0.5),
	},
});
export default TrackPlayerProgress;
