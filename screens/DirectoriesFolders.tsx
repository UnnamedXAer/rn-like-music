import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer, { Track, TrackType } from 'react-native-track-player';
import DirRenderItem from '../components/DirTree/dirTreeRenderItem';
import useStoragePermission from '../hooks/useStoragePermission';
import Dir from '../models/dir';
import { View as ThemedView, Text as ThemedText } from '../components/UI/Themed';
import { StateError } from '../types/reactTypes';
import { readStorage } from '../utils/storage/readStorage';
import Button from '../components/UI/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types/RootStackTypes';
import { TracksActionTypes, TracksContext } from '../context/tracksContext';
import useColorScheme from '../hooks/useColorScheme';
import DirItemSeparator from '../components/DirTree/dirItemSeparator';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Directories'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const DirectoriesFolders: React.FC<Props> = ({ navigation }) => {
	const colorScheme = useColorScheme();
	const [error, setError] = useState<StateError>(null);
	const [directories, setDirectories] = useState<Dir[] | null>(null);
	const [subDirectories, setSubDirectories] = useState<{ [path: string]: Dir[] }>({});
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const isStoragePermissionGranted = useStoragePermission();
	const [selectedFiles, setSelectedFiles] = useState<{
		[path: string]: Dir;
	}>({});
	const [loadingDirs, setLoadingDirs] = useState<{
		[path: string]: boolean;
	}>({});
	const { dispatchTracks } = useContext(TracksContext);

	useEffect(() => {
		if (!directories && !error && !loading && !refreshing) {
			loadDirectories();
		}
	}, [directories, error, loading, refreshing]);

	useEffect(() => {
		if (refreshing && !loading && isStoragePermissionGranted) {
			loadDirectories();
		}
	}, [loading, refreshing, isStoragePermissionGranted]);

	const readDirectory = async (dir: Dir) => {
		setLoadingDirs((prevState) => ({ ...prevState, [dir.path]: true }));
		try {
			const dirs = await readStorage(dir.path);
			setSubDirectories((prevState) => ({
				...prevState,
				[dir.path]: [...dirs],
			}));
		} catch (err) {
			setError(err.message);
		}
		setLoadingDirs((prevState) => {
			const updatedState = { ...prevState };
			console.log('updatedState', updatedState);
			delete updatedState[dir.path];
			console.log('updatedState', updatedState, prevState);
			return updatedState;
		});
	};

	const loadDirectories = async () => {
		setDirectories(null);
		setLoading(true);
		setError(null);
		try {
			const dirs = await readStorage(RNFS.ExternalStorageDirectoryPath);

			setDirectories(dirs);
		} catch (err) {
			console.log('readStorage Err', err);
			setError(err.message);
		} finally {
			setRefreshing(false);
			setLoading(false);
		}
	};

	const toggleSelectSong = async (dir: Dir) => {
		if (dir.path.endsWith('.mp3')) {
			setSelectedFiles((prevState) => {
				if (prevState[dir.path]) {
					const updatedState = { ...prevState };
					delete updatedState[dir.path];
					return updatedState;
				}
				return { ...prevState, [dir.path]: dir };
			});
		} else {
			Alert.alert('Alert', dir.name + ' is not a mp3 file.');
		}
	};

	const directoryItemPressHandler = async (parentDir: Dir) => {
		if (parentDir.isFile) {
			await toggleSelectSong(parentDir);
		} else if (parentDir.isDirectory) {
			readDirectory(parentDir);
		}
	};

	const updateQueueHandler = async () => {
		const tracks: Track[] = [];

		for (const path in selectedFiles) {
			const dir = selectedFiles[path];
			const track: Track = {
				url: 'file://' + dir.path,
				title: dir.name,
				id: dir.path,
				type: TrackType.Default,
				artist: 'artist: ' + dir.name,
			};
			tracks.push(track);
		}
		await TrackPlayer.add(tracks);
		dispatchTracks({ type: TracksActionTypes.SetQueue, payload: tracks });
		try {
			await TrackPlayer.clearNowPlayingMetadata();
		} catch (err) {
			console.log('clearNowPlayingMetadata err', err);
		}
		navigation.navigate('Play');
	};

	return (
		<ThemedView style={styles.container}>
			{error && <Text>{error}</Text>}
			{loading && !refreshing && <ActivityIndicator />}
			<FlatList
				style={styles.flatList}
				data={directories}
				ListHeaderComponent={
					<View style={styles.headerContainer}>
						<ThemedText style={styles.flatListTitle}>Music</ThemedText>
						<Button onPress={updateQueueHandler} title="Ok" size={'small'} />
					</View>
				}
				ItemSeparatorComponent={() => <DirItemSeparator />}
				onRefresh={() => {
					setRefreshing(true);
				}}
				keyExtractor={(item) => item.path}
				refreshing={refreshing}
				bounces
				renderItem={({ item }) => (
					<DirRenderItem
						loadingDirs={loadingDirs}
						item={item}
						onDirPress={directoryItemPressHandler}
						subDirectories={subDirectories}
						selectedFiles={selectedFiles}
						color={Colors[colorScheme].text}
					/>
				)}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	flatList: {
		paddingRight: Layout.spacing(1),
	},
	flatListTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default DirectoriesFolders;
