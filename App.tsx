import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import DirectoriesContextProvider from './context/directoriesContext';
import PlayerContextProvider from './context/playerContext';
import TracksContextProvider from './context/tracksContext';

import useStoragePermission from './hooks/useStoragePermission';
import Navigator from './navigation';
import NoPermissionsScreen from './screens/NoPermissionsScreen';
import { trackPlayerInit } from './trackPlayer/playerInit';

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
		<DirectoriesContextProvider>
			<PlayerContextProvider>
				<TracksContextProvider>
					<Navigator />
				</TracksContextProvider>
			</PlayerContextProvider>
		</DirectoriesContextProvider>
	);
};

export default App;
