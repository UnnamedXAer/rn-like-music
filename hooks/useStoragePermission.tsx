import { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';

export default function useStoragePermission() {
	const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);

	useEffect(() => {
		PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
		).then((res) => {
			console.log('READ_EXTERNAL_STORAGE: ', res);
			if (res === PermissionsAndroid.RESULTS.GRANTED) {
				setStoragePermissionGranted(true);
			}
		});
		// PermissionsAndroid.request(
		// 	PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
		// ).then((res) => {
		// 	console.log('WRITE_EXTERNAL_STORAGE', res);
		// 	if (res === PermissionsAndroid.RESULTS.GRANTED) {
		// 		// setStoragePermissionGranted(true);
		// 	}
		// });
	}, []);
	return storagePermissionGranted;
}
