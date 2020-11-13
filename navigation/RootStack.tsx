import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Directories from '../screens/Directories';
import PlayScreen from '../screens/PlayScreen';

const Stack = createStackNavigator();

export default function RootStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Play" component={PlayScreen} />
			<Stack.Screen name="Directories" component={Directories} />
		</Stack.Navigator>
	);
}
