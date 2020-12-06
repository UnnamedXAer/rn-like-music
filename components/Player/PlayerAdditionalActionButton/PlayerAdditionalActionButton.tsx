import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import useColorScheme from '../../../hooks/useColorScheme';
import { Text } from '../../UI/Themed';

export type PlayerAdditionalPropAction = (action: PlayerAdditionalProp) => void;
export type PlayerAdditionalProp = 'play-randomly' | 'repeat-queue';

interface Props {
	onPress: PlayerAdditionalPropAction;
	action: PlayerAdditionalProp;
	active: boolean;
}

export default function PlayerAdditionalActionButton({ onPress, action, active }: Props) {
	const colorsScheme = useColorScheme();

	return (
		<View
			style={[
				styles.container,
				action === 'play-randomly'
					? { marginLeft: iconSize + iconSize }
					: { marginRight: iconSize },
			]}>
			<FontAwesome5.Button
				onPress={() => onPress(action)}
				name={action === 'play-randomly' ? 'random' : 'retweet'}
				size={iconSize}
				color={active ? Colors[colorsScheme].text : Colors.colors.normal}
				backgroundColor={'transparent'}
				underlayColor={Colors[colorsScheme].background}
				activeOpacity={0.5}>
				<Text style={styles.text}>{active ? 'ON' : 'OFF'}</Text>
			</FontAwesome5.Button>
		</View>
	);
}

const iconSize = Layout.deviceSize === 'tablet' ? 56 : 24;

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: iconSize * 0.45,
		width: iconSize,
	},
});
