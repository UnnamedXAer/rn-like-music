import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';

export default function LoadingScreen() {
	return (
		<>
			<StatusBar />
			<SafeAreaView
				// eslint-disable-next-line react-native/no-inline-styles
				style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</SafeAreaView>
		</>
	);
}
