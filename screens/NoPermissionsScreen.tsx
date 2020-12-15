import React from 'react';
import { Text, SafeAreaView, StatusBar } from 'react-native';
import { View } from '../components/UI/Themed';

export default function NoPermissionsScreen() {
	return (
		<>
			<StatusBar />
			<SafeAreaView>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text>
						Storage permission is required for app to be able to play your
						music.
					</Text>
				</View>
			</SafeAreaView>
		</>
	);
}
