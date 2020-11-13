// import { Ionicons, Feather, Octicons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import { ColorSchemeName } from '../../hooks/useColorScheme';
import useColorScheme from '../../hooks/useColorScheme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from './Themed';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonMode = 'outlined' | 'contained' | 'text';
type ButtonIconComponent = 'Ionicos' | 'Feather' | 'Octicons';

interface Props {
	onPress: (...args: any) => void | Promise<void>;
	title?: string;
	icon?: string;
	iconComponentName?: ButtonIconComponent;
	disabled?: boolean;
	loading?: boolean;
	theme?: ColorSchemeName;
	size?: ButtonSize;
	mode?: ButtonMode;
	error?: boolean;
}

export default function Button({
	onPress,
	title,
	icon,
	loading,
	disabled,
	iconComponentName,
	theme,
	mode = 'outlined',
	size = 'medium',
	error,
}: Props) {
	let colorScheme = useColorScheme();
	if (theme) {
		colorScheme = theme;
	}
	let iconElement: JSX.Element | null = null;

	const fontSize = Layout.spacing(size === 'medium' ? 3 : size === 'small' ? 2 : 4);

	let borderColor: string = 'transparent';
	if (disabled) {
		borderColor = Colors.colors.disabled;
	} else if (error) {
		borderColor = Colors.colors.error;
	} else if (mode !== 'text') {
		borderColor = Colors[colorScheme].text;
	}

	let color = Colors[colorScheme].text;
	if (disabled) {
		color = Colors.colors.disabled;
	} else if (mode === 'contained') {
		color = Colors[colorScheme].background;
	}

	const styles = StyleSheet.create({
		touchable: {
			borderRadius: Layout.baseRadius * 2,
			borderColor: borderColor,
			backgroundColor: mode === 'contained' ? borderColor : undefined,
			borderWidth: 1,
			padding: Layout.spacing(size === 'small' ? 0.5 : 1),
			margin: Layout.spacing(),
			...(Platform.OS === 'ios'
				? {
						shadowColor: '#fff',
						shadowOffset: {
							width: Layout.baseRadius,
							height: Layout.baseRadius,
						},
						shadowOpacity: 0.6,
				  }
				: {
						elevation: 5,
				  }),
		},
		container: {
			marginHorizontal: Layout.spacing(),
			flexDirection: 'row',
			alignItems: 'center',
		},
		iconContainer: {
			width: fontSize,
			height: fontSize,
			justifyContent: 'center',
			alignItems: 'center',
		},
		icon: {},
		text: {
			marginLeft: Layout.spacing(),
			fontSize,
			color,
		},
	});

	if (loading) {
		iconElement = (
			<ActivityIndicator color={Colors[colorScheme].text} size={fontSize} />
		);
	}
	// else if (icon) {
	// 	switch (iconComponentName) {
	// 		case undefined:
	// 		case 'Ionicos':
	// 			iconElement = (
	// 				<Ionicons
	// 					style={styles.icon}
	// 					name={icon}
	// 					size={fontSize + 8}
	// 					color={color}
	// 				/>
	// 			);
	// 			break;
	// 		case 'Feather':
	// 			iconElement = (
	// 				<Feather
	// 					style={styles.icon}
	// 					name={icon}
	// 					size={fontSize}
	// 					color={color}
	// 				/>
	// 			);
	// 			break;
	// 		case 'Octicons':
	// 			iconElement = (
	// 				<Octicons
	// 					style={styles.icon}
	// 					name={icon}
	// 					size={fontSize}
	// 					color={color}
	// 				/>
	// 			);
	// 			break;
	// 		default:
	// 			assertUnreachable(iconComponentName);
	// 	}
	// }

	return (
		<TouchableOpacity
			style={styles.touchable}
			onPress={onPress}
			disabled={loading || disabled}
			activeOpacity={mode === 'contained' ? 0.7 : 0.4}>
			<View style={styles.container}>
				{iconElement && <View style={styles.iconContainer}>{iconElement}</View>}
				{title && (
					<Text style={styles.text} selectable={false}>
						{title}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	);
}
