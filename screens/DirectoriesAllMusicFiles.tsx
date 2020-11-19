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

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Directories'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const DirectoriesAllMusicFiles: React.FC<Props> = ({ navigation }) => {
	const [error, setError] = useState<StateError>(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const isStoragePermissionGranted = useStoragePermission();
	const [selectedFiles, setSelectedFiles] = useState<{
		[path: string]: Dir;
	}>({});
	const { dispatchTracks } = useContext(TracksContext);

	return (
		<ThemedView style={styles.container}>
			{error && <Text>{error}</Text>}
			{loading && !refreshing && <ActivityIndicator />}
			<Text>All music Files</Text>
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

export default DirectoriesAllMusicFiles;
