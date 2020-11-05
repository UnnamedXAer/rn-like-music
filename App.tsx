import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	StatusBar,
	View,
	Text,
	Button,
	PermissionsAndroid,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import { StateError } from './types/reactTypes';
import readStorage from './utils/storage/readStorage';

// declare const global: { HermesInternal: null | {} };

const App = () => {
	const [cnt, setCnt] = useState(0);
	const [error, setError] = useState<StateError>(null);
	const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
	const [directories, setDirectories] = useState<string[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

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

	// useEffect(() => {
	// 	if (storagePermissionGranted && !directories && !error && !loading) {
	// 		loadDirectories();
	// 	}
	// }, [directories, error, loading, storagePermissionGranted]);

	useEffect(() => {
		if (refreshing && !loading && storagePermissionGranted) {
			loadDirectories();
		}
	}, [loading, refreshing, storagePermissionGranted]);

	const loadDirectories = async () => {
		setLoading(true);
		setError(null);
		try {
			console.log('About to load dirs...');
			const dirs = await readStorage();
			console.log('dirs', dirs);
			setDirectories(dirs);
		} catch (err) {
			setError(err.message);
		} finally {
			setRefreshing(false);
			setLoading(false);
		}
	};

	return (
		<>
			<StatusBar />
			<SafeAreaView>
				<View style={styles.container}>
					<Text>Hello music</Text>
					<Text>{new Date().toLocaleString('en-US')}</Text>
					<Button
						onPress={() => setCnt((prevValue) => prevValue + 1)}
						title="Add"
					/>
					<Text>{cnt}</Text>
					{error && <Text>{error}</Text>}
					{loading && !refreshing && <ActivityIndicator />}
					<FlatList
						data={directories || ['a', 'b', 'c']}
						ListHeaderComponent={
							<View>
								<Text
									style={{
										fontSize: 24,
										fontWeight: 'bold',
										textAlign: 'center',
									}}>
									Music
								</Text>
							</View>
						}
						onRefresh={() => {
							setRefreshing(true);
						}}
						refreshing={refreshing}
						bounces
						keyExtractor={(_item, i) => '' + i}
						renderItem={(info) => {
							return (
								<View style={{ borderBottomWidth: 1 }}>
									<Text>{info.item}</Text>
								</View>
							);
						}}
					/>
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default App;
