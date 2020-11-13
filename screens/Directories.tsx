import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer, { TrackType } from 'react-native-track-player';
import RenderItem from '../components/DirTree/dirTreeRenderItem';
import useStoragePermission from '../hooks/useStoragePermission';
import Dir from '../models/dir';
import { StateError } from '../types/reactTypes';
import { readStorage } from '../utils/storage/readStorage';

export default function Directories() {
	const [error, setError] = useState<StateError>(null);
	const [directories, setDirectories] = useState<Dir[] | null>(null);
	const [subDirectories, setSubDirectories] = useState<{ [key: string]: Dir[] }>({});
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const isStoragePermissionGranted = useStoragePermission();

	useEffect(() => {
		if (refreshing && !loading && isStoragePermissionGranted) {
			loadDirectories();
		}
	}, [loading, refreshing, isStoragePermissionGranted]);

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

	const loadDirectories = async () => {
		setDirectories(null);
		setLoading(true);
		setError(null);
		try {
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

	const addSong = async (dir: Dir) => {
		// await readStorage();
		if (dir.path.endsWith('.mp3')) {
			await TrackPlayer.add({
				url: 'file://' + dir.path,
				title: dir.name,
				id: dir.name,
				type: TrackType.Default,
				artist: 'artist: ' + dir.name,
			});
		} else {
			Alert.alert('Alert', dir.name + ' is not a mp3 file.');
		}
	};

	const directoryItemPressHandler = async (parentDir: Dir) => {
		if (parentDir.isFile) {
			await addSong(parentDir);
		} else if (parentDir.isDirectory) {
			readDirectory(parentDir);
		}
	};

	return (
		<View>
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
				keyExtractor={(item) => item.path}
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
	);
}

const styles = StyleSheet.create({
	container: {},
	soundPlayerWrapper: {
		marginVertical: 16,
		marginHorizontal: 16,
		borderColor: 'lightblue',
		borderWidth: 1,
		borderStyle: 'dashed',
	},
	flatListTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
