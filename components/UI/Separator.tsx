import React from 'react';
import { View } from 'react-native';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function Separator() {
	const colorsScheme = useColorScheme();
	return (
		<View
			style={{
				marginVertical: 4,
				height: 1,
				width: '90%',
				backgroundColor: Colors[colorsScheme].text,
				opacity: 0.5,
			}}
		/>
	);
}
