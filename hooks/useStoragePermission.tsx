import { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';

export default function useStoragePermission() {
	const [readPermissionGranted, setReadPermissionGranted] = useState(false);
	const [writePermissionGranted, setWritePermissionGranted] = useState(false);

	useEffect(() => {
		PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
			.then((res) => {
				if (res === PermissionsAndroid.RESULTS.GRANTED) {
					setReadPermissionGranted(true);
				}
			})
			.then(() => {
				PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				).then((res) => {
					if (res === PermissionsAndroid.RESULTS.GRANTED) {
						setWritePermissionGranted(true);
					}
				});
			});
	}, []);

	return readPermissionGranted && writePermissionGranted;
}
