import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import PlayScreen from '../screens/PlayScreen';
import DirectoriesTabNavigator from './DirectoriesTab';
import { RootStackParamList } from './types/RootStackNavigatorTypes';
import TrackPlayer from 'react-native-track-player';

const RootStack = createStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
	const colorScheme = useColorScheme();
	return (
		<RootStack.Navigator
			// initialRouteName="Directories"
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
			<RootStack.Screen
				name="Play"
				component={PlayScreen}
				options={({ navigation }) => ({
					// TODO - remove after fix the tracks state
					headerLeft: (props) => {
						return (
							<FontAwesome5Icon.Button
								color={props.tintColor}
								name="satellite-dish"
								backgroundColor="transparent"
								activeOpacity={0.4}
								underlayColor={Colors[colorScheme].background}
								onPress={() => TrackPlayer.getQueue().then(console.log)}
							/>
						);
					},
					headerRight: (props) => {
						return (
							<FontAwesome5Icon.Button
								color={props.tintColor}
								name="plus"
								backgroundColor="transparent"
								activeOpacity={0.4}
								underlayColor={Colors[colorScheme].background}
								onPress={() => navigation.push('Directories')}
							/>
						);
					},
				})}
			/>
			<RootStack.Screen
				name="Directories"
				options={{ title: 'Music' }}
				component={DirectoriesTabNavigator}
			/>
		</RootStack.Navigator>
	);
}
