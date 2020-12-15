import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootStackNavigator from './RootStackNavigator';

export default function Navigator() {

	return (
		<NavigationContainer>
			<RootStackNavigator />
		</NavigationContainer>
	);
}
