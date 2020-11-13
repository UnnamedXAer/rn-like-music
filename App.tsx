import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import useCachedResources from './hooks/useCachedResources';

import useStoragePermission from './hooks/useStoragePermission';
import Navigator from './navigation';
import NoPermissionsScreen from './screens/NoPermissionsScreen';
import { trackPlayerInit } from './trackPlayer/playerInit';

// declare const global: { HermesInternal: null | {} };

const App = () => {
	const isLoadingComplete = useCachedResources();
	const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
	const isStoragePermissionGranted = useStoragePermission();
	console.log('isStoragePermissionGranted', isStoragePermissionGranted);
	useEffect(() => {
		(async () => {
			await trackPlayerInit();
			setIsPlayerInitialized(true);
		})();
	}, []);

	if (!isLoadingComplete) {
		return null;
	}

	if (!isStoragePermissionGranted) {
		return <NoPermissionsScreen />;
	}

	if (!isPlayerInitialized) {
		return <ActivityIndicator />;
	}

	return <Navigator />;
};

export default App;
