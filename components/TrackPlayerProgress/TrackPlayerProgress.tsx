import React from 'react';
import { useProgress } from 'react-native-track-player';
import { View } from 'react-native';
import { Text } from '../UI/Themed';
import Layout from '../../constants/Layout';

export default function TrackPlayerProgress() {
	const progress = useProgress();
	return (
		<View style={{ paddingHorizontal: Layout.spacing(3) }}>
			<Text>
				{progress.position} / {progress.duration}
			</Text>
		</View>
	);
}
