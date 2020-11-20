import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer, { Track, TrackType } from 'react-native-track-player';
import DirRenderItem from '../components/DirTree/dirTreeRenderItem';
// import useStoragePermission from '../hooks/useStoragePermission';
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
import DirectoriesListHeader from '../components/DirectoriesListHeader/directoriesListHeader';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Directories'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const DirectoriesFolders: React.FC<Props> = ({ navigation }) => {
	const colorScheme = useColorScheme();
	const [error, setError] = useState<StateError>(null);
	const [subDirectories, setSubDirectories] = useState<{ [path: string]: Dir[] }>({});
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	// const isStoragePermissionGranted = useStoragePermission();
	const [selectedFiles, setSelectedFiles] = useState<{
		[path: string]: Dir;
	}>({});
	const [loadingDirs, setLoadingDirs] = useState<{
		[path: string]: boolean;
	}>({});
	const [queueUpdateInProgress, setQueueUpdateInProgress] = useState(false);
	const [currentPath, setCurrentPath] = useState(RNFS.ExternalStorageDirectoryPath);
	const { dispatchTracks } = useContext(TracksContext);

	const loadDirectories = useCallback(async (path: string) => {
		setLoading(true);
		setLoadingDirs((prevState) => ({ ...prevState, [path]: true }));
		setError(null);
		try {
			const dirs = await readStorage(path);

			setSubDirectories((prevState) => ({
				...prevState,
				[path]: [...dirs],
			}));
		} catch (err) {
			setSubDirectories((prevState) => ({
				...prevState,
				[path]: [],
			}));
			console.log('loadDirectories Err', err);
			setError(err.message);
		} finally {
			setRefreshing(false);
			setLoading(false);
			setLoadingDirs((prevState) => {
				const updatedState = { ...prevState };
				delete updatedState[path];
				return updatedState;
			});
		}
	}, []);

	useEffect(() => {
		if (subDirectories[currentPath] === undefined) {
			loadDirectories(currentPath);
		}
	}, [currentPath, loadDirectories, subDirectories]);

	const toggleSelectSong = async (dir: Dir) => {
		if (dir.path.endsWith('.mp3') || dir.path.endsWith('.flac')) {
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
			setCurrentPath(parentDir.path);
		}
	};

	const addTracksToQueue = async () => {
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
	};

	const updateQueueHandler = async () => {
		setQueueUpdateInProgress(true);
		await addTracksToQueue();
		navigation.navigate('Play');
	};

	return (
		<ThemedView style={styles.container}>
			{error && <Text>{error}</Text>}
			{loading && !refreshing && <ActivityIndicator />}
			<View style={styles.headerContainer}>
				<ThemedText style={styles.flatListTitle}>Music</ThemedText>
				<Button
					onPress={updateQueueHandler}
					title="Play it"
					size={'small'}
					loading={queueUpdateInProgress}
				/>
			</View>
			<FlatList
				style={styles.flatList}
				data={subDirectories[currentPath]}
				stickyHeaderIndices={[0]}
				ListHeaderComponent={() => (
					<DirectoriesListHeader
						currentPath={currentPath}
						onPress={setCurrentPath}
					/>
				)}
				ItemSeparatorComponent={() => <DirItemSeparator />}
				onRefresh={() => {
					setRefreshing(true);
				}}
				keyExtractor={(item) => item.path}
				refreshing={refreshing}
				bounces
				renderItem={({ item }) => (
					<DirRenderItem
						loading={loadingDirs[item.path]}
						item={item}
						onDirPress={directoryItemPressHandler}
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
		// backgroundColor: 'tomato',
		// paddingRight: Layout.spacing(1),
	},
	flatListTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default DirectoriesFolders;
