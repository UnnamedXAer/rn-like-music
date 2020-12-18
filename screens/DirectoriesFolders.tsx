import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	BackHandler,
} from 'react-native';
import DirRenderItem from '../components/DirTree/dirTreeRenderItem';
import Dir from '../models/dir';
import { View as ThemedView, Text as ThemedText } from '../components/UI/Themed';
import { getDirInfo, getDirSongs } from '../utils/storage/externalStorage';
import Button from '../components/UI/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types/RootStackNavigatorTypes';
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
import { ShowToastOptions } from '../types/types';
import Playable from '../models/playable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/types';
import { DirectoriesActionTypes } from '../store/directories/types';
import { setQueueTracks } from '../store/queue/actions';
import { DirStat } from '../models/dirStat';
import DirInfoDialog from '../components/dirInfoDialog';

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
	const [dirInfo, setDirInfo] = useState<DirStat | null>(null);
	const [longPressedDir, setLongPressedDir] = useState<Dir | null>(null);
	const directoriesState = useSelector((rootState: RootState) => rootState.directories);
	const dispatch = useDispatch();

	useEffect(() => {
		const backAction = () => {
			if (directoriesState.currentPath === BASE_PATH) {
				return false;
			}
			dispatch({
				type: DirectoriesActionTypes.GoBack,
			});
			return true;
		};

		const handler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => {
			handler.remove();
		};
	}, [directoriesState.currentPath, dispatch]);

	const toggleSelectSong = async (song: Playable) => {
		setSelectedFiles((prevState) => {
			if (prevState[song.path]) {
				const updatedState = { ...prevState };
				delete updatedState[song.path];
				return updatedState;
			}
			return { ...prevState, [song.path]: song };
		});
	};

	const directoryItemPressHandler = (dir: Dir | Playable) => {
		if (dir instanceof Playable) {
			toggleSelectSong(dir);
			return;
		}

		dispatch({
			type: DirectoriesActionTypes.SetCurrentDir,
			payload: dir.prettyPath,
		});
	};

	const directoryItemLongPressHandler = (dir: Dir | Playable) => {
		openDirectoryMenu(dir);
	};

	const openDirectoryMenu = (dir: Dir | Playable) => {
		setLongPressedDir(dir);
	};

	const dialogOptionHandler = async (option: DirDialogOptions) => {
		if (longPressedDir === null) {
			setLongPressedDir(null);
			showToast(INTERNAL_ERROR_MSG, 'No dir selected by long press!');
			return;
		}

		switch (option) {
			case 'ADD_TO_QUEUE':
			case 'PLAY': {
				try {
					setQueueUpdateInProgress(true);
					setLongPressedDir(null);

					const songs = await getDirSongs(longPressedDir.path);
					const resetQueue = option === 'PLAY';
					addTracksToQueue(
						songs,
						resetQueue,
						`Looks like there are no files to play in the "${longPressedDir.name}" folder :(.`,
					);
				} catch (err) {
					setQueueUpdateInProgress(true);
					showToast({
						message: INTERNAL_ERROR_MSG,
						devMessage: err.message,
					});
				}
				break;
			}
			case 'SHOW_INFO': {
				setLongPressedDir(null);
				const info = await getDirInfo(longPressedDir);
				setDirInfo(info);
				break;
			}
			default:
				assertUnreachable(option);
		}
	};

	const addTracksToQueue = async (
		songs: Playable[],
		resetQueue: boolean,
		noDirsError: string | ShowToastOptions,
	) => {
		if (songs.length === 0) {
			setQueueUpdateInProgress(false);
			showToast(noDirsError as string); // @i: suppress ts complaining
			return;
		}
		try {
			await dispatch(setQueueTracks(songs, resetQueue));
			navigation.navigate('Play');
		} catch (err) {
			setQueueUpdateInProgress(false);
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
	};

	const updateQueueHandler = () => {
		setQueueUpdateInProgress(true);
		const songs = Object.values(selectedFiles);
		addTracksToQueue(songs, true, {
			message: 'You did not choose any songs to play.',
			devMessage: '"selectedFiles" object is empty.',
		});
	};

	const listHeaderPressHandler = (path: string) => {
		if (path === '') {
			return;
		}
		dispatch({
			type: DirectoriesActionTypes.SetCurrentDir,
			payload: path,
		});
	};

	return (
		<ThemedView style={styles.container}>
			<Button
				onPress={() => {
					dispatch({
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
						onDirLongPress={() => directoryItemLongPressHandler(item)}
						onDirPress={() => directoryItemPressHandler(item)}
						color={Colors[colorScheme].text}
						isSelected={selectedFiles[item.path] !== undefined}
					/>
				)}
			/>
			<DirInfoDialog info={dirInfo} onDismiss={() => setDirInfo(null)} />
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
