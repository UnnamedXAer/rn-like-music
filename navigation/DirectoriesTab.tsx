import React, { useEffect } from 'react';
import {
	createMaterialTopTabNavigator,
	MaterialTopTabBarOptions,
} from '@react-navigation/material-top-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { DirectoriesTabParamList } from './types/DirectoriesTabNavigatorTypes';
import DirectoriesFolders from '../screens/DirectoriesFolders';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { DirectoriesActionTypes } from '../store/directories/types';
import { BASE_PATH } from '../constants/strings';
import {
	getMainDirsAndPrettyPrefixes,
	readStorage,
} from '../utils/storage/externalStorage';
import { getPathByPrettyPath } from '../utils/storage/prettyPathPrefixes';
import showToast from '../utils/showToast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/types';

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

	const dispatch = useDispatch();
	const state = useSelector((storeState: RootState) => storeState.directories);

	useEffect(() => {
		if (state.mainDirectoriesRead === false) {
			dispatch({
				type: DirectoriesActionTypes.SetLoading,
				payload: true,
			});

			getMainDirsAndPrettyPrefixes()
				.then((mainDirsAndPrefixes) => {
					const { mainDirs, prettyPathPrefixes } = mainDirsAndPrefixes;
					dispatch({
						type: DirectoriesActionTypes.SetPrettyPathPrefixes,
						payload: prettyPathPrefixes,
					});
					dispatch({
						type: DirectoriesActionTypes.SetDirectories,
						payload: { dirs: mainDirs, path: BASE_PATH },
					});
				})
				.catch((err) => {
					showToast('Fail to read device files storage.', err.message);
				});
		}
	}, [dispatch, state.mainDirectoriesRead]);

	useEffect(() => {
		const prettyPath = state.currentPath;
		if (prettyPath !== BASE_PATH && !state.subDirectories[prettyPath]) {
			const path = getPathByPrettyPath(prettyPath, state.prettyPathPrefixes);
			readStorage(path)
				.then((dirs) => {
					dirs.forEach((dir) => (dir.prettyPath = prettyPath + '/' + dir.name));

					dispatch({
						type: DirectoriesActionTypes.SetDirectories,
						payload: {
							path: prettyPath,
							dirs,
						},
					});
				})
				.catch((err) => {
					showToast('Fail to read device files storage.', err.message);
				});
		}
	}, [dispatch, state.currentPath, state.prettyPathPrefixes, state.subDirectories]);

	return (
		<DirectoriesTab.Navigator
			tabBarOptions={tabBarOptions}
			sceneContainerStyle={{
				backgroundColor: Colors[colorScheme].background,
			}}>
			<DirectoriesTab.Screen
				name="Folders"
				options={{
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
		</DirectoriesTab.Navigator>
	);
};

export default DirectoriesTabNavigator;
