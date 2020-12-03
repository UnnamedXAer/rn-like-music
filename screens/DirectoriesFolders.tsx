import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	BackHandler,
} from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import DirRenderItem from '../components/DirTree/dirTreeRenderItem';
import Dir from '../models/dir';
import { View as ThemedView, Text as ThemedText } from '../components/UI/Themed';
import { getDirInfo, getDirSongs } from '../utils/storage/externalStorage';
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
import { BASE_PATH, INTERNAL_ERROR_MSG } from '../constants/strings';
import { mapDirsToTracks, mapSelectedFilesToTracks } from '../utils/mapData';
import {
	DirectoriesActionTypes,
	DirectoriesContext,
} from '../context/directoriesContext';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Directories'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const DirectoriesFolders: React.FC<Props> = ({ navigation }) => {
	const colorScheme = useColorScheme();
	const [selectedFiles, setSelectedFiles] = useState<{
		[path: string]: Dir;
	}>({});
	const [queueUpdateInProgress, setQueueUpdateInProgress] = useState(false);
	const [longPressedDir, setLongPressedDir] = useState<Dir | null>(null);
	const { dispatchTracks } = useContext(TracksContext);
	const { directoriesState, dispatchDirectories } = useContext(DirectoriesContext);

	useEffect(() => {
		const backAction = () => {
			if (directoriesState.currentPath === BASE_PATH) {
				return false;
			}
			dispatchDirectories({
				type: DirectoriesActionTypes.GoBack,
			});
			return true;
		};

		const handler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => {
			handler.remove();
		};
	}, [directoriesState.currentPath, dispatchDirectories]);

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

	const directoryItemPressHandler = (dir: Dir) => {
		if (dir.isFile) {
			toggleSelectSong(dir);
		}
		if (dir.isDirectory) {
			dispatchDirectories({
				type: DirectoriesActionTypes.SetCurrentDir,
				payload: dir.prettyPath,
			});
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
			navigation.navigate('Play');
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
			console.log('addTracksToQueue err', err);
		}
	};

	const updateQueueHandler = async () => {
		setQueueUpdateInProgress(true);
		const tracks = mapSelectedFilesToTracks(selectedFiles);
		if (tracks.length === 0) {
			setQueueUpdateInProgress(false);
			return showToast(
				'You did not choose any music to play.',
				'"selectedFiles" is empty.',
			);
		}
		await addTracksToQueue(tracks, true);
	};

	const listHeaderPressHandler = (path: string) => {
		if (path === '') {
			return;
		}
		dispatchDirectories({
			type: DirectoriesActionTypes.SetCurrentDir,
			payload: path,
		});
	};

	return (
		<ThemedView style={styles.container}>
			<Button
				onPress={() => {
					dispatchDirectories({
						type: DirectoriesActionTypes.ResetState,
					});
				}}
				size="small"
				mode="contained"
				title="RESET"
			/>
			<Text
				style={{ color: 'green', backgroundColor: 'lightyellow' }}
				numberOfLines={3}>
				{directoriesState.currentPath}
			</Text>

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
				ListEmptyComponent={
					directoriesState.loading ? <ActivityIndicator /> : null
				}
				data={directoriesState.subDirectories[directoriesState.currentPath]}
				stickyHeaderIndices={[0]}
				ListHeaderComponent={() => (
					<DirectoriesListHeader
						currentPath={directoriesState.currentPath}
						onPress={listHeaderPressHandler}
					/>
				)}
				ItemSeparatorComponent={() => <DirItemSeparator />}
				keyExtractor={(item) => item.path}
				bounces
				renderItem={({ item }) => (
					<DirRenderItem
						item={item}
						onDirLongPress={directoryItemLongPressHandler}
						onDirPress={directoryItemPressHandler}
						color={Colors[colorScheme].text}
						isSelected={selectedFiles[item.path] !== undefined}
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
