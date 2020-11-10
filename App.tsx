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
import RNFS from 'react-native-fs';
import RenderItem from './components/DirTree/dirTreeRenderItem';
import Dir from './models/dir';
import { StateError } from './types/reactTypes';
import { readStorage, readStorageFile } from './utils/storage/readStorage';

// declare const global: { HermesInternal: null | {} };

const App = () => {
	const [cnt, setCnt] = useState(0);
	const [error, setError] = useState<StateError>(null);
	const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
	const [directories, setDirectories] = useState<Dir[] | null>(null);
	const [subDirectories, setSubDirectories] = useState<{ [key: string]: Dir[] }>({});
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
		setDirectories(null);
		setLoading(true);
		setError(null);
		try {
			console.log('About to load dirs...');
			const dirs = await readStorage(RNFS.ExternalStorageDirectoryPath);

			console.log('dirs', dirs);
			setDirectories(dirs);
		} catch (err) {
			setError(err.message);
		} finally {
			setRefreshing(false);
			setLoading(false);
		}
	};

	const directoryItemPressHandler = async (parentDir: Dir) => {
		console.log('about to read dir: ', parentDir.path);
		if (parentDir.isFile) {
			readFile(parentDir);
		} else if (parentDir.isDirectory) {
			readDirectory(parentDir);
		}
	};

	const readFile = async (dir: Dir) => {
		try {
			const data = await readStorageFile(dir.path);
			// setCurrenFile(data);
		} catch (err) {
			setError(err.message);
		}
	};

	const readDirectory = async (dir: Dir) => {
		try {
			const dirs = await readStorage(dir.path);
			setSubDirectories((prevState) => ({
				...prevState,
				[dir.path]: [...dirs],
			}));
		} catch (err) {
			setError(err.message);
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
						onPress={() => {
							setCnt((prevValue) => prevValue + 1);
							setRefreshing(true);
						}}
						title="Add"
					/>
					<Text>{cnt}</Text>
					<Text>directories len: {directories?.length}</Text>
					{error && <Text>{error}</Text>}
					{loading && !refreshing && <ActivityIndicator />}

					<FlatList
						data={directories}
						ListHeaderComponent={
							<View>
								<Text style={styles.flatListTitle}>Music</Text>
							</View>
						}
						onRefresh={() => {
							setRefreshing(true);
						}}
						refreshing={refreshing}
						bounces
						renderItem={({ item }) => (
							<RenderItem
								item={item}
								onDirPress={directoryItemPressHandler}
								subDirectories={subDirectories}
							/>
						)}
					/>
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {},
	flatListTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default App;
