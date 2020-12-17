import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import useColorScheme from '../../hooks/useColorScheme';
import { Text } from './Themed';

interface Props {
	title: string;
	iconName?: string;
	iconVendor?: 'FontAwesome5' | 'MaterialIcons';
	onPress: () => void;
}

const DialogItem: React.FC<Props> = ({ onPress, title, iconName, iconVendor }) => {
	const colorScheme = useColorScheme();
	let icon: React.ReactNode = null;

	if (iconName) {
		switch (iconVendor) {
			case 'MaterialIcons':
				icon = (
					<MaterialIconsIcon
						name={iconName!}
						size={Layout.spacing(3)}
						style={styles.icon}
						color={Colors[colorScheme].text}
					/>
				);
				break;
			case 'FontAwesome5':
			default:
				icon = (
					<FontAwesome5Icon
						name={iconName as string}
						size={Layout.spacing(2.5)}
						style={styles.icon}
						color={Colors[colorScheme].text}
					/>
				);
				break;
		}
	}

	return (
		<TouchableHighlight
			onPress={onPress}
			activeOpacity={0.9}
			underlayColor={Colors[colorScheme].touchHighlight}>
			<View style={styles.content}>
				{icon}
				<Text>{title}</Text>
			</View>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	content: {
		paddingVertical: Layout.spacing(),
		marginHorizontal: Layout.spacing(),
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginRight: Layout.spacing(2),
	},
});

export default DialogItem;
