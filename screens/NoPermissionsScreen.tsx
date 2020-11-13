import React from 'react';
import { Text, SafeAreaView, StatusBar } from 'react-native';

export default function NoPermissionsScreen() {
	return (
		<>
			<StatusBar />
			<SafeAreaView>
				<Text>
					Storage permission is required for app to be able to play your music.
				</Text>
			</SafeAreaView>
		</>
	);
}
