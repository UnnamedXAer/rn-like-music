import React, { useEffect } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import useStoragePermission from '../hooks/useStoragePermission';
import Navigator from '../navigation';
import NoPermissionsScreen from '../screens/NoPermissionsScreen';
import { RootState } from '../store/types';
import { trackPlayerInit } from '../utils/trackPlayer/playerInit';

const Layout: React.FC = () => {
	// @improvement: move to store
	const isStoragePermissionGranted = useStoragePermission();
	const playerInitialized = useSelector(
		(rootState: RootState) => rootState.player.initialized,
	);

	useEffect(() => {
		trackPlayerInit();
	}, []);

	useEffect(() => {
		AppState.addEventListener('change', (state) => {
			if (state === 'active') {
				console.log('Activated!!!');
			}
		});
	}, []);

	if (!isStoragePermissionGranted) {
		return <NoPermissionsScreen />;
	}

	if (playerInitialized === false) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size={64} color={Colors.colors.info} />
			</View>
		);
	}

	return <Navigator />;
};

export default Layout;
