import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import useColorScheme from '../../hooks/useColorScheme';

interface Props {
	onPress: () => void;
}

const MenuVerticalButton: React.FC<Props> = ({ onPress }) => {
	const colorScheme = useColorScheme();
	const dotBgColor = Colors[colorScheme].text;
	return (
		<TouchableHighlight
			style={styles.touchable}
			underlayColor={Colors[colorScheme].touchHighlight}
			activeOpacity={0.9}
			onPress={onPress}>
			<View style={styles.icon}>
				<View style={{ ...styles.dot, backgroundColor: dotBgColor }} />
				<View style={{ ...styles.dot, backgroundColor: dotBgColor }} />
				<View style={{ ...styles.dot, backgroundColor: dotBgColor }} />
			</View>
		</TouchableHighlight>
	);
};

const iconSize = Layout.spacing(
	Layout.deviceSize === 'tablet' ? 4 : Layout.deviceSize === 'small' ? 2.5 : 3,
);
const dotSize = iconSize / 5;
const styles = StyleSheet.create({
	touchable: {
		width: iconSize,
		paddingHorizontal: Layout.spacing(Layout.deviceSize === 'tablet' ? 2 : 1),
		alignItems: 'center',
		borderRadius: Layout.baseRadius,
	},
	icon: {
		flex: 1,
		justifyContent: 'center',
	},
	dot: {
		height: dotSize,
		width: dotSize,
		borderRadius: dotSize / 2,
		margin: dotSize / 4,
	},
});

export default MenuVerticalButton;
