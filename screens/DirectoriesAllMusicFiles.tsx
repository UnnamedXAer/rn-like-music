import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	Alert,
	ScrollView,
} from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer, { Track, TrackType } from 'react-native-track-player';
import DirRenderItem from '../components/DirTree/dirTreeRenderItem';
import useStoragePermission from '../hooks/useStoragePermission';
import Dir from '../models/dir';
import { View as ThemedView, Text as ThemedText } from '../components/UI/Themed';
import { StateError } from '../types/reactTypes';
import Button from '../components/UI/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types/RootStackNavigatorTypes';
import showToast from '../utils/showToast';
import Separator from '../components/UI/Separator';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Directories'>;

interface Props {
	navigation: ScreenNavigationProp;
}

const DirectoriesAllMusicFiles: React.FC<Props> = ({ navigation }) => {
	const [error, setError] = useState<StateError>(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [dirs, setDirs] = useState<any[]>([]);
	const [fsStat, setFsStat] = useState<any>(null);
	const [content, setContent] = useState({});

	const loadData = useCallback(async () => {
		// cons
		try {
			const data = await RNFS.getAllExternalFilesDirs();
			setDirs(data);

			const data2 = await RNFS.stat('/storage');
			const data3 = await RNFS.stat('/storage/emulated');
			const data4 = await RNFS.stat('/storage/emulated/0');
			setFsStat({ data2, data3, data4 });

			const data5 = await RNFS.readDir('/storage');
			setContent(data5);
		} catch (err) {
			showToast('', err.message);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<ThemedView style={styles.container}>
			{error && <ThemedText>{error}</ThemedText>}
			{loading && !refreshing && <ActivityIndicator />}
			<ThemedText>All music Files</ThemedText>
			<ScrollView>
				<ThemedText style={{ fontSize: 22 }}>
					<ThemedText>{JSON.stringify(dirs, null, 2)}</ThemedText>
					<ThemedText>{JSON.stringify(fsStat, null, 2)}</ThemedText>
				</ThemedText>
				<Separator />
				<Separator />
				<Separator />
				<ThemedText style={{ fontSize: 22 }}>
					<ThemedText>{JSON.stringify(content, null, 2)}</ThemedText>
				</ThemedText>
			</ScrollView>
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
