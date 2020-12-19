import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { RootStackParamList } from '../navigation/types/RootStackNavigatorTypes';
import { View as ThemedView } from '../components/UI/Themed';
import PlayerQueue from '../components/Player/PlayerQueue/playerQueue';
import PlayerCurrentSongState from '../components/Player/PlayerCurrentSongState/playerCurrentSongState';
import PlayerActionsSection from '../components/PlayerActions/playerActions';
import { SkipSong } from '../components/Player/PlayerMainSkipButton/playerMainSkipButton';
import QueueSongMenu, {
	QueueSongOptionsOption,
} from '../components/Player/QueueSongMenu/queueSongMenu';
import assertUnreachable from '../utils/assertUnreachable';
import { getDirInfo } from '../utils/storage/externalStorage';
import { RouteProp } from '@react-navigation/native';
import showToast from '../utils/showToast';
import { INTERNAL_ERROR_MSG } from '../constants/strings';
import Layout from '../constants/Layout';
import { PlayerAdditionalPropAction } from '../components/Player/PlayerAdditionalActionButton/PlayerAdditionalActionButton';
import Dir from '../models/dir';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/types';
import Playable from '../models/playable';
import * as PlayerActions from '../store/player/actions';
import * as QueueActions from '../store/queue/actions';
import { PlayNavigationProp } from '../navigation/types/PlayerScreenNavigatorTypes';
import DirInfoDialog from '../components/dirInfoDialog';
import { DirStat } from '../models/dirStat';

type PlayScreenRouteProp = RouteProp<RootStackParamList, 'Play'>;
interface Props {
	navigation: PlayNavigationProp;
	route: PlayScreenRouteProp;
}

const PlayScreen: React.FC<Props> = ({ navigation }) => {
	const [dirInfo, setDirInfo] = useState<DirStat | null>(null);
	const {
		isPlaying,
		currentTrack,
		random: playRandomly,
		repeat: repeatQueue,
	} = useSelector((rootState: RootState) => rootState.player);
	const queue = useSelector((rootState: RootState) => rootState.queue);
	const [longPressedSong, setLongPressedSong] = useState<Dir | null>(null);
	const dispatch = useDispatch();

	const playTrack = async (song: Playable) => {
		dispatch(PlayerActions.playTrack(song));
	};

	const mainButtonPressHandler = async () => {
		if (currentTrack === null) {
			showToast("The queue is empty, let's add some songs.");
			return navigation.navigate('Directories', { screen: 'Folders' });
		}
		try {
			await dispatch(PlayerActions.togglePlay());
		} catch (err) {
			showToast(
				INTERNAL_ERROR_MSG,
				`Fail to ${isPlaying ? 'pause' : 'play'}.\n` + err.message,
			);
		}
	};

	const skipSongHandler: SkipSong = async (direction) => {
		try {
			await dispatch(PlayerActions.skipTrack(direction));
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
	};

	const queueItemPressHandler = (dir: Dir) => {
		return playTrack(dir);
	};

	const queueItemLongPressHandler = async (dir: Dir) => {
		setLongPressedSong(dir);
	};
	const queueMenuItemPressHandler = async (option: QueueSongOptionsOption) => {
		if (longPressedSong === null) {
			return showToast(INTERNAL_ERROR_MSG, 'Value of longPressedSong is null');
		}

		try {
			switch (option) {
				case 'PLAY':
					playTrack(longPressedSong);
					break;
				case 'REMOVE_FROM_QUEUE':
					try {
						await dispatch(
							QueueActions.removeQueueTrack(longPressedSong.path),
						);
						showToast('track removed', longPressedSong.name);
					} catch (err) {
						showToast('Sorry, could not remove the track.', err.message);
					}
					break;
				case 'SHOW_INFO':
					const info = await getDirInfo(longPressedSong);
					setDirInfo(info);
					break;
				default:
					assertUnreachable(option);
			}
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
		setLongPressedSong(null);
	};

	const songSeekHandler = async (position: number) => {
		try {
			await TrackPlayer.seekTo(position);
			if (isPlaying === false) {
				await TrackPlayer.play();
			}
		} catch (err) {
			showToast(INTERNAL_ERROR_MSG, err.message);
		}
	};

	const additionalPlayerPropActionHandler: PlayerAdditionalPropAction = (action) => {
		if (action === 'repeat-queue') {
			return dispatch(PlayerActions.togglePlayerParameter('repeat'));
		}
		dispatch(PlayerActions.togglePlayerParameter('random'));
	};

	return (
		<>
			<ThemedView style={styles.container}>
				<PlayerQueue
					queue={queue.tracks}
					currentTrackId={currentTrack?.path}
					loading={false}
					onSongPress={queueItemPressHandler}
					onSongLongPress={queueItemLongPressHandler}
					onNoSongPress={() => {
						navigation.navigate('Directories', { screen: 'Folders' });
					}}
				/>
				<PlayerCurrentSongState
					currentTrack={currentTrack}
					onSeek={songSeekHandler}
				/>
				<PlayerActionsSection
					mainButtonAction={isPlaying ? 'pause' : 'play'}
					mainButtonPressHandler={mainButtonPressHandler}
					nextTrack={null}
					previousTrack={null}
					skipSong={skipSongHandler}
					playRandomly={playRandomly}
					repeatQueue={repeatQueue}
					additionalPlayerPropAction={additionalPlayerPropActionHandler}
				/>
			</ThemedView>
			<DirInfoDialog info={dirInfo} onDismiss={() => setDirInfo(null)} />
			<QueueSongMenu
				onItemPress={queueMenuItemPressHandler}
				onPressOutside={() => setLongPressedSong(null)}
				visible={longPressedSong !== null}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: Layout.spacing(
			Layout.deviceSize === 'tablet' ? 3 : Layout.deviceSize === 'large' ? 2 : 1,
		),
	},
});
export default PlayScreen;
