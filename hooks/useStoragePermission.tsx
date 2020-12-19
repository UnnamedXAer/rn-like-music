import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, PermissionsAndroid } from 'react-native';

export default function useStoragePermission() {
	const [permissionsChecked, setPermissionsChecked] = useState(false);
	const [areStoragePermissionsGranted, setAreStoragePermissionsGranted] = useState(
		false,
	);

	useEffect(() => {
		// @improvement: Add custom buttons (as second param, "request" method may need to be used).
		PermissionsAndroid.requestMultiple([
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
		]).then((res) => {
			if (
				res['android.permission.READ_EXTERNAL_STORAGE'] ===
					PermissionsAndroid.RESULTS.GRANTED &&
				res['android.permission.WRITE_EXTERNAL_STORAGE'] ===
					PermissionsAndroid.RESULTS.GRANTED
			) {
				setAreStoragePermissionsGranted(true);
			}
			setPermissionsChecked(true);
		});
	}, []);

	useEffect(() => {
		if (permissionsChecked === true && areStoragePermissionsGranted === false) {
			const appStateChangeHandler = async (nextAppState: AppStateStatus) => {
				if (nextAppState === 'active') {
					const readPermission = await PermissionsAndroid.check(
						PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
					);
					const writePermission = await PermissionsAndroid.check(
						PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					);
					if (readPermission && writePermission) {
						setAreStoragePermissionsGranted(readPermission);
					}
				}
			};
			AppState.addEventListener('change', appStateChangeHandler);
			return () => {
				AppState.removeEventListener('change', appStateChangeHandler);
			};
		}
	}, [areStoragePermissionsGranted, permissionsChecked]);

	return areStoragePermissionsGranted;
}
