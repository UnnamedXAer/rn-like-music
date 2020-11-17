import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import PlayScreen from '../screens/PlayScreen';
import DirectoriesTabNavigator from './DirectoriesTab';
import { RootStackParamList } from './types/RootStackTypes';

const RootStack = createStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
	const colorScheme = useColorScheme();
	console.log('colorScheme', colorScheme);
	return (
		<RootStack.Navigator
			screenOptions={{
				headerTintColor: Colors[colorScheme].text,
				headerBackground: (props) => (
					<View
						{...props}
						style={{
							backgroundColor: Colors[colorScheme].background,
							flex: 1,
						}}
					/>
				),
			}}>
			<RootStack.Screen name="Play" component={PlayScreen} />
			<RootStack.Screen
				name="Directories"
				options={{ title: 'Music' }}
				component={DirectoriesTabNavigator}
			/>
		</RootStack.Navigator>
	);
}
