import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import useStoragePermission from '../hooks/useStoragePermission';
import Navigator from '../navigation';
import NoPermissionsScreen from '../screens/NoPermissionsScreen';
import { addStateQueueToPlayer } from '../store/queue/actions';
import { RootState } from '../store/types';
import { trackPlayerInit } from '../utils/trackPlayer/playerInit';

const Layout: React.FC = () => {
	// @improvement: move to store
	const isStoragePermissionGranted = useStoragePermission();
	const { initialized: playerInitialized, destroyed: playerDestroyed } = useSelector(
		(rootState: RootState) => rootState.player,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (playerInitialized === false) {
			trackPlayerInit();
		}
	}, [playerInitialized]);

	const appStateChangeHandler = useCallback(
		(nextAppState: AppStateStatus) => {
			if (nextAppState === 'active') {
				if (playerDestroyed === true) {
					trackPlayerInit().then(() => {
						dispatch(addStateQueueToPlayer());
					});
				}
			}
		},
		[dispatch, playerDestroyed],
	);

	useEffect(() => {
		AppState.addEventListener('change', appStateChangeHandler);
		return () => {
			AppState.removeEventListener('change', appStateChangeHandler);
		};
	}, [appStateChangeHandler]);

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
