import { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';

export default function useStoragePermission() {
	const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);

	useEffect(() => {
		PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE').then(
			(res) => {
				console.log('res', res);
				if (res === PermissionsAndroid.RESULTS.GRANTED) {
					setStoragePermissionGranted(true);
				}
			},
		);
	}, []);
	return storagePermissionGranted;
}
