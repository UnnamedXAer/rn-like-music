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
	TouchableOpacity,
} from 'react-native';
import RNFS from 'react-native-fs';
import Dir from './models/dir';
import { StateError } from './types/reactTypes';
import readStorage from './utils/storage/readStorage';

// declare const global: { HermesInternal: null | {} };

const App = () => {
	const [cnt, setCnt] = useState(0);
	const [error, setError] = useState<StateError>(null);
	const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
	const [directories, setDirectories] = useState<Dir[] | null>(null);
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

	const directoryPressHandler = async (dir: Dir) => {
		console.log('about to read dir: ', dir.path);
		if (dir.isFile) {
			//play it
		} else if (dir.isDirectory) {
			try {
				const dirs = await readStorage(dir.path);
				setDirectories((prevState) => {
					if (!prevState) {
						return null;
					}
					const idx = prevState?.findIndex((x) => x.path === dir.path);
					const updatedState = [...prevState];
					const subDirs = [...dirs];
					updatedState[idx] = new Dir(
						dir.path,
						dir.name,
						dir.size,
						dir.isDirectory,
						dir.isFile,
						subDirs,
						[idx],
						/* subfolders example
					//0 folder1 parentindexes: [] or null ?
							//0 subfolder1
							//1 subfolder2
								//0 subsubfolder1 => parentindexes like: [0,1]
									//0 subsubsubfolder1 => [0,1,0]
									//1 subsubsubfolder1 => [0,1,0]
								//1 subsubfolder1 => parentindexes like: [0,1]
								//2 subsubfolder1 => parentindexes like: [0,1]
									//1 subsubsubfolder1 => [0,1,2]
							//2 subfolder3
						//1 forlder2
						*/
					);
					return updatedState;
				});
			} catch (err) {
				setError(err.message);
			}
		}
		setError('Unable to recognize directory: ' + dir.path);
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
						data={directories}
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
						renderItem={({ item }) => {
							return (
								<View
									style={{
										borderBottomWidth: 1,
										borderColor: 'lightgreen',
									}}>
									<TouchableOpacity
										onPress={() => directoryPressHandler(item)}>
										<Text>
											{item.isDirectory
												? `dir: ${item.path}`
												: item.isFile
												? `file: ${item.path}`
												: `unknown type: ${item.path}`}
										</Text>
									</TouchableOpacity>
									{item.subDirs && (
										<FlatList
											style={{
												backgroundColor: '#ccc',
												marginRight: 15,
											}}
											data={item.subDirs}
											keyExtractor={(_item, i) => '' + i}
											renderItem={({ item: subItem }) => {
												return (
													<TouchableOpacity
														onPress={() =>
															// directoryPressHandler(subItem)
															console.log(
																`The ${subItem.path} is a subdir of ${item.path},`,
															)
														}>
														<Text>
															{subItem.isDirectory
																? `dir: ${subItem.path}`
																: subItem.isFile
																? `file: ${subItem.path}`
																: `unknown type: ${subItem.path}`}
														</Text>
													</TouchableOpacity>
												);
											}}
										/>
									)}
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
