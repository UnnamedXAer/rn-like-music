import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import useColorScheme from '../hooks/useColorScheme';
import { Text } from './UI/Themed';
import Button from './UI/Button';

interface Props {
	onPress: () => void;
}

export default function SearchPlaceholder({ onPress }: Props) {
	const colorsScheme = useColorScheme();
	return (
		<View style={styles.container}>
			<Button
				onPress={() => {}}
				icon="settings"
				iconComponentName="Feather"
				theme={colorsScheme}
				mode="text"
			/>
			<View style={[styles.placeholder, { backgroundColor: Colors.colors.dark }]}>
				<TouchableNativeFeedback onPress={onPress}>
					<Text
						selectable={false}
						style={[styles.placeholderText, { color: Colors.colors.light }]}>
						Search
					</Text>
				</TouchableNativeFeedback>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingRight: Layout.spacing(),
		paddingVertical: Layout.spacing(),
		flexDirection: 'row',
		alignItems: 'center',
	},
	placeholder: {
		flex: 1,
		paddingTop: Layout.spacing(),
		paddingBottom: Layout.spacing(),
		paddingLeft: Layout.spacing(2),
		paddingRight: Layout.spacing(2),
		borderRadius: Layout.baseRadius,
		borderWidth: 1,
	},
	placeholderText: {
		fontSize: Layout.deviceSize === 'small' ? Layout.spacing(1.5) : Layout.spacing(2),
	},
});
