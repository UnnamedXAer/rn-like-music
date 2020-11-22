import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TracksState } from '../../context/tracksContext';
import { getMainBtnContainerSize } from '../../utils/getMainBtnSize';
import PlayerMainButton, {
	MainButtonProps,
} from '../Player/PlayerMainButton/playerMainButton';
import PlayerMainSkipButton from '../Player/PlayerMainSkipButton/playerMainSkipButton';
import PlayerSkipButtonSongName from '../Player/PlayerMainSkipButton/PlayerSkipButtonSongName/playerSkipButtonSongName';

interface Props {
	mainButtonPressHandler: MainButtonProps['onPress'];
	mainButtonAction: MainButtonProps['buttonAction'];
	nextTrack: TracksState['nextTrack'];
	previousTrack: TracksState['previousTrack'];
}

const PlayerActions: React.FC<Props> = ({
	mainButtonAction,
	mainButtonPressHandler,
	nextTrack,
	previousTrack,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.skipActions}>
				<View style={styles.skipActionContainer}>
					<PlayerMainSkipButton direction="previous" />
					<PlayerSkipButtonSongName
						track={previousTrack}
						direction="previous"
					/>
				</View>
				<View style={styles.skipActionContainer}>
					<PlayerMainSkipButton direction="next" />
					<PlayerSkipButtonSongName track={nextTrack} direction="next" />
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
	mainButton: {
		// backgroundColor: 'tomato',
		// alignItems: 'center',
		// height: getMainBtnContainerSize(),
	},
	skipActions: {
		position: 'absolute',
		bottom: 0,

		borderWidth: 2,
		borderColor: 'green',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'flex-end',
	},
	skipActionContainer: {
		flex: 5,
		borderWidth: 2,
		borderColor: 'yellow',
	},
});

export default PlayerActions;
