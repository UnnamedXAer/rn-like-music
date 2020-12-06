import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TracksState } from '../../context/tracksContext';
import PlayerAdditionalActionButton, {
	PlayerAdditionalPropAction,
} from '../Player/PlayerAdditionalActionButton/PlayerAdditionalActionButton';
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
	playRandomly: boolean;
	repeatQueue: boolean;
	additionalPlayerPropAction: PlayerAdditionalPropAction;
}

const PlayerActions: React.FC<Props> = ({
	mainButtonAction,
	mainButtonPressHandler,
	nextTrack,
	previousTrack,
	skipSong,
	playRandomly,
	repeatQueue,
	additionalPlayerPropAction,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.additionalActions}>
				<View style={styles.skipActionContainer}>
					<PlayerAdditionalActionButton
						action="repeat-queue"
						onPress={additionalPlayerPropAction}
						active={repeatQueue}
					/>
				</View>
				<View style={styles.skipActionContainer}>
					<PlayerAdditionalActionButton
						action="play-randomly"
						onPress={additionalPlayerPropAction}
						active={playRandomly}
					/>
				</View>
			</View>
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
	additionalActions: {
		position: 'absolute',
		top: 0,

		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'flex-end',
	},
	skipActionContainer: {
		flex: 5,
	},
});

export default PlayerActions;
