import React from 'react';
import {
	createMaterialTopTabNavigator,
	MaterialTopTabBarOptions,
} from '@react-navigation/material-top-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { DirectoriesTabParamList } from './types/DirectoriesTabNavigatorTypes';
import DirectoriesFolders from '../screens/DirectoriesFolders';
import DirectoriesAllMusicFiles from '../screens/DirectoriesAllMusicFiles';
import DirectoriesPlaylists from '../screens/DirectoriesPlaylists';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

const DirectoriesTab = createMaterialTopTabNavigator<DirectoriesTabParamList>();

const DirectoriesTabNavigator = () => {
	const colorScheme = useColorScheme();
	const tabBarOptions: MaterialTopTabBarOptions = {
		inactiveTintColor: Colors[colorScheme].text,
		activeTintColor:
			colorScheme === 'dark' ? Colors.colors.lighter : Colors.colors.darker,
		style: {
			backgroundColor: Colors[colorScheme].background,
		},
		allowFontScaling: true,
		pressColor: Colors.colors.normal,
		pressOpacity: 0.2,
		indicatorStyle: {
			backgroundColor: Colors.colors.warning,
			height: 4,
		},
	};
	if (colorScheme === 'dark') {
		tabBarOptions.activeTintColor = Colors.dark.text;
	}

	return (
		<DirectoriesTab.Navigator tabBarOptions={tabBarOptions}>
			<DirectoriesTab.Screen
				name="Folders"
				options={{
					// title: 'Folders',
					tabBarIcon: ({ color, focused }) => (
						<FontAwesome5
							name="folder"
							color={color}
							size={focused ? 16 : 14}
						/>
					),
				}}
				component={DirectoriesFolders}
			/>
			<DirectoriesTab.Screen name="All" component={DirectoriesAllMusicFiles} />
			<DirectoriesTab.Screen name="Playlists" component={DirectoriesPlaylists} />
		</DirectoriesTab.Navigator>
	);
};

export default DirectoriesTabNavigator;
