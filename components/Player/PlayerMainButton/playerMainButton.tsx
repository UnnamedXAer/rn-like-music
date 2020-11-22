import React, { useState } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import { PlayerAction } from '../../../types/types';
import { getMainBtnContainerSize } from '../../../utils/getMainBtnSize';
import PlayerMainButtonPauseIcon from './PlayerMainButtonPauseIcon/playerMainButtonPauseIcon';
import PlayerMainButtonStartIcon from './PlayerMainButtonStartIcon/playerMainButtonStartIcon';

export interface MainButtonProps {
	buttonAction: PlayerAction;
	onPress: () => void;
}

const PlayerMainButton: React.FC<MainButtonProps> = (props) => {
	const [pressed, setPressed] = useState(false);
	let buttonIcon = <PlayerMainButtonStartIcon containerSize={containerSize} />;

	switch (props.buttonAction) {
		case 'stop':
			buttonIcon = <View />;
			break;
		case 'pause':
			buttonIcon = <PlayerMainButtonPauseIcon containerSize={containerSize} />;
			break;
		default:
			break;
	}

	return (
		<TouchableHighlight
			onPress={props.onPress}
			onPressIn={() => setPressed(true)}
			onPressOut={() => setPressed(false)}
			style={styles.circle}
			activeOpacity={1}
			underlayColor={Colors.colors.dark}>
			<>
				{buttonIcon}
				{pressed && <View style={styles.overlay} />}
			</>
		</TouchableHighlight>
	);
};

const containerSize = getMainBtnContainerSize();

const styles = StyleSheet.create({
	circle: {
		height: containerSize,
		width: containerSize,
		borderRadius: containerSize / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.colors.dark,
		elevation: 6,
		position: 'relative',
	},
	overlay: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		left: 0,
		top: 0,
		borderRadius: containerSize / 2,
		backgroundColor: 'white',
		opacity: 0.3,
	},
});

export default PlayerMainButton;
