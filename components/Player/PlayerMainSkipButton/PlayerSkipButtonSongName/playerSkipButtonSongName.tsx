import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Layout from '../../../../constants/Layout';
import { TracksState } from '../../../../context/tracksContext';
import { Text } from '../../../UI/Themed';

interface Props {
	track: TracksState['nextTrack'];
}

export default function PlayerSkipButtonSongName({ track }: Props) {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={
					track
						? () => ToastAndroid.show(track.title!, ToastAndroid.SHORT)
						: undefined
				}>
				<Text /* TODO: font */
					numberOfLines={1}
					ellipsizeMode="tail"
					style={styles.text}>
					{track ? track.title : '- - -'}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: Layout.spacing(
			Layout.deviceSize === 'tablet' ? 2 : Layout.deviceSize === 'medium' ? 1 : 0.5,
		),
	},
	text: {
		textAlign: 'center',
		fontSize:
			Layout.deviceSize === 'tablet' ? 16 : Layout.deviceSize === 'small' ? 10 : 14,
	},
});
