import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import useColorScheme from '../../../hooks/useColorScheme';

export type SkipButtonDirection = 'next' | 'previous';
export type SkipSong = (direction: SkipButtonDirection) => Promise<void> | void;

interface Props {
	direction: SkipButtonDirection;
	onPress: SkipSong;
}

export default function PlayerMainSkipButton({ direction, onPress }: Props) {
	const colorsScheme = useColorScheme();

	return (
		<View
			style={[
				styles.container,
				direction === 'next'
					? { marginLeft: iconSize }
					: { marginRight: iconSize },
			]}>
			<FontAwesome5.Button
				onPress={() => onPress(direction)}
				name={direction === 'next' ? 'step-forward' : 'step-backward'}
				size={iconSize}
				color={Colors[colorsScheme].text}
				backgroundColor={'transparent'}
				underlayColor={Colors[colorsScheme].background}
				activeOpacity={0.5}
			/>
		</View>
	);
}

const iconSize = Layout.deviceSize === 'tablet' ? 72 : 40;

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
});
