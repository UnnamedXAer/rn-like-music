import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import useStoragePermission from './hooks/useStoragePermission';
import Navigator from './navigation';
import NoPermissionsScreen from './screens/NoPermissionsScreen';
import store from './store/store';
import { trackPlayerInit } from './utils/trackPlayer/playerInit';

// declare const global: { HermesInternal: null | {} };

const App = () => {
	const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
	const isStoragePermissionGranted = useStoragePermission();

	useEffect(() => {
		(async () => {
			await trackPlayerInit();
			setIsPlayerInitialized(true);
		})();
	}, []);

	if (!isStoragePermissionGranted) {
		return <NoPermissionsScreen />;
	}

	if (!isPlayerInitialized) {
		return <ActivityIndicator />;
	}

	return (
		<Provider store={store}>
			<Navigator />
		</Provider>
	);
};

export default App;
