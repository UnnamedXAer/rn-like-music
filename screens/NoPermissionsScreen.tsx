import React from 'react';
import { Linking, StatusBar } from 'react-native';
import Button from '../components/UI/Button';
import { View, Text } from '../components/UI/Themed';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { APP_NAME } from '../constants/strings';
import useColorScheme from '../hooks/useColorScheme';

export default function NoPermissionsScreen() {
	const colorScheme = useColorScheme();

	return (
		<View style={{ flex: 1 }}>
			<StatusBar translucent backgroundColor={Colors[colorScheme].statusBarColor} />
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					padding: Layout.spacing(Layout.deviceSize === 'tablet' ? 5 : 3),
				}}>
				<Text
					style={{
						fontSize: Layout.spacing(5),
						fontWeight: '700',
						fontVariant: ['small-caps'],
						marginBottom: Layout.spacing(2),
					}}>
					{APP_NAME}
				</Text>
				<Text
					style={{
						fontSize: Layout.spacing(Layout.deviceSize === 'tablet' ? 4 : 3),
						textAlign: 'center',
						marginBottom: Layout.spacing(2),
					}}>
					Storage permissions are required for the{' '}
					<Text style={{ fontWeight: '700', fontVariant: ['small-caps'] }}>
						{APP_NAME}
					</Text>{' '}
					application to be able to play your audio files.
				</Text>
				<Button
					onPress={() => {
						Linking.openSettings();
					}}
					mode="contained"
					title="Open settings"
				/>
			</View>
		</View>
	);
}
