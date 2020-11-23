import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TracksState } from '../../context/tracksContext';
import PlayerMainButton, {
	MainButtonProps,
} from '../Player/PlayerMainButton/playerMainButton';
import PlayerMainSkipButton, {
	SkipSong,
} from '../Player/PlayerMainSkipButton/playerMainSkipButton';
import PlayerSkipButtonSongName from '../Player/PlayerMainSkipButton/PlayerSkipButtonSongName/playerSkipButtonSongName';

interface Props {
	mainButtonPressHandler: MainButtonProps['onPress'];
	mainButtonAction: MainButtonProps['buttonAction'];
	nextTrack: TracksState['nextTrack'];
	previousTrack: TracksState['previousTrack'];
	skipSong: SkipSong;
}

const PlayerActions: React.FC<Props> = ({
	mainButtonAction,
	mainButtonPressHandler,
	nextTrack,
	previousTrack,
	skipSong,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.skipActions}>
				<View style={styles.skipActionContainer}>
					<PlayerMainSkipButton direction="previous" onPress={skipSong} />
					<PlayerSkipButtonSongName track={previousTrack} />
				</View>
				<View style={styles.skipActionContainer}>
					<PlayerMainSkipButton direction="next" onPress={skipSong} />
					<PlayerSkipButtonSongName track={nextTrack} />
				</View>
			</View>
			<PlayerMainButton
				onPress={mainButtonPressHandler}
				buttonAction={mainButtonAction}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		position: 'relative',
		paddingBottom: 20,
	},
	skipActions: {
		position: 'absolute',
		bottom: 0,

		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'flex-end',
	},
	skipActionContainer: {
		flex: 5,
	},
});

export default PlayerActions;
