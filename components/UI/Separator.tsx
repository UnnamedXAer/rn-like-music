import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function Separator({
	separatorStyle: style,
}: {
	separatorStyle?: StyleProp<ViewStyle>;
}) {
	const colorsScheme = useColorScheme();
	return (
		<View
			style={[
				styles.separator,
				{ backgroundColor: Colors[colorsScheme].text },
				{ ...style },
			]}
		/>
	);
}

const styles = StyleSheet.create({
	separator: {
		marginVertical: 4,
		height: 1,
		width: '90%',
		opacity: 0.5,
	},
});
