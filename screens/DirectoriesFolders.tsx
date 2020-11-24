import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer, { Track, TrackType } from 'react-native-track-player';
import DirRenderItem from '../components/DirTree/dirTreeRenderItem';
// import useStoragePermission from '../hooks/useStoragePermission';
import Dir from '../models/dir';
import { View as ThemedView, Text as ThemedText } from '../components/UI/Themed';
import { StateError } from '../types/reactTypes';
import { getDirInfo, getDirSongs, readStorage } from '../utils/storage/externalStorage';
import Button from '../components/UI/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types/RootStackNavigatorTypes';
import { TracksActionTypes, TracksContext } from '../context/tracksContext';
import useColorScheme from '../hooks/useColorScheme';
import DirItemSeparator from '../components/DirTree/dirItemSeparator';
import Colors from '../constants/Colors';
import DirectoriesListHeader from '../components/DirectoriesListHeader/directoriesListHeader';
import DirItemDialog, {
	DirDialogOptions,
} from '../components/DirTree/DirTreeItemDialog/dirItemDialog';
import assertUnreachable from '../utils/assertUnreachable';
import showToast from '../utils/showToast';
import { INTERNAL_ERROR_MSG } from '../constants/strings';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Directories'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const mapSelectedFilesToTracks = (selectedFiles: { [path: string]: Dir }) => {
	const dirs = Object.values(selectedFiles);
	const tracks = mapDirsToTracks(dirs);
	return tracks;
};

const mapDirsToTracks = (dirs: Dir[]) =>
	dirs.map(
		(dir) =>
			({
				url: 'file://' + dir.path,
				title: dir.name,
				id: dir.path,
				type: TrackType.Default,
				artist: 'artist: ' + dir.name,
			} as Track),
	);

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
	const [longPressedDir, setLongPressedDir] = useState<Dir | null>(null);
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
			showToast('Alert', dir.name + ' is not a mp3 file.');
		}
	};

	const directoryItemPressHandler = async (dir: Dir) => {
		if (dir.isFile) {
			await toggleSelectSong(dir);
		} else if (dir.isDirectory) {
			setCurrentPath(dir.path);
		}
	};

	const directoryItemLongPressHandler = (dir: Dir) => {
		openDirectoryMenu(dir);
	};

	const openDirectoryMenu = (dir: Dir) => {
		setLongPressedDir(dir);
	};

	const dialogOptionHandler = async (option: DirDialogOptions) => {
		if (longPressedDir === null) {
			throw new Error('No dir selected by long press!');
		}
		switch (option) {
			case 'ADD_TO_QUEUE': {
				break;
			}

			case 'PLAY': {
				try {
					const songs = await getDirSongs(longPressedDir.path);
					addTracksToQueue(mapDirsToTracks(songs), true);
				} catch (err) {
					console.log('err', err);
					showToast({
						message: INTERNAL_ERROR_MSG,
						devMessage: err.message,
					});
				}
				break;
			}
			case 'SHOW_INFO': {
				const info = await getDirInfo(longPressedDir.path);
				console.log('info', info);
				break;
			}
			default:
				assertUnreachable(option);
		}
		setLongPressedDir(null);
	};

	const addTracksToQueue = async (tracks: Track[], resetQueue: boolean) => {
		try {
			if (resetQueue === true) {
				await TrackPlayer.reset();
			}
			await TrackPlayer.add(tracks);
			dispatchTracks({ type: TracksActionTypes.SetQueue, payload: tracks });
			await TrackPlayer.play();
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
			console.log('addTracksToQueue err', err);
		}
		navigation.navigate('Play');
	};

	const updateQueueHandler = async () => {
		setQueueUpdateInProgress(true);
		const tracks = mapSelectedFilesToTracks(selectedFiles);
		await addTracksToQueue(tracks, true);
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
					loadDirectories(currentPath);
				}}
				keyExtractor={(item) => item.path}
				refreshing={refreshing}
				bounces
				renderItem={({ item }) => (
					<DirRenderItem
						loading={loadingDirs[item.path]}
						item={item}
						onDirLongPress={directoryItemLongPressHandler}
						onDirPress={directoryItemPressHandler}
						color={Colors[colorScheme].text}
					/>
				)}
			/>
			<DirItemDialog
				visible={longPressedDir !== null}
				onPressOutside={() => setLongPressedDir(null)}
				onItemPress={dialogOptionHandler}
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
	flatListTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default DirectoriesFolders;
