import React from 'react';
import { useProgress } from 'react-native-track-player';
import { Text, View } from 'react-native';

export default function TrackPlayerProgress() {
	const progress = useProgress();
	return (
		<View>
			<Text>
				{progress.position} / {progress.duration}
			</Text>
		</View>
	);
}
