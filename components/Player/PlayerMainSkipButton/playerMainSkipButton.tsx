import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import useColorScheme from '../../../hooks/useColorScheme';
import { getMainBtnContainerSize } from '../../../utils/getMainBtnSize';

interface Props {
	direction: 'next' | 'previous';
}

export default function PlayerMainSkipButton({ direction }: Props) {
	// const [pressed, setPressed] = useState(false);
	const colorsScheme = useColorScheme();

	return (
		<TouchableHighlight
			onPress={() =>
				console.log('pressing - next btn', new Date().toLocaleTimeString())
			}
			// onPressIn={() => setPressed(true)}
			// onPressOut={() => setPressed(false)}
			style={[
				styles.container,
				direction === 'next'
					? { marginLeft: iconSize }
					: { marginRight: iconSize },
			]}
			activeOpacity={0.2}
			underlayColor={Colors.colors.dark}>
			<>
				<View style={styles.content}>
					<FontAwesome5
						name={direction === 'next' ? 'step-forward' : 'step-backward'}
						size={iconSize}
						color={Colors[colorsScheme].text}
					/>
				</View>
				{/* {pressed && <View style={styles.overlay} />} */}
			</>
		</TouchableHighlight>
	);
}

const iconSize = Layout.deviceSize === 'tablet' ? 72 : 40;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		backgroundColor: 'brown',
		borderColor: Colors.colors.normal,
		borderWidth: 1,
		position: 'relative',
	},
	content: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	overlay: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		left: 0,
		top: 0,
		backgroundColor: 'white',
		opacity: 0.3,
	},
});
