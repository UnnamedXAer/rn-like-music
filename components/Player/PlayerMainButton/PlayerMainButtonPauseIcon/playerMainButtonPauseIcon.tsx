import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors, { playerIconsGradient } from '../../../../constants/Colors';

interface Props {
	containerSize: number;
}

const PlayerMainButtonPauseIcon: React.FC<Props> = ({ containerSize }) => {
	return (
		<View
			style={[
				styles.container,
				{
					width: containerSize / 1.8,
					height: containerSize / 1.8,
				},
			]}>
			<LinearGradient
				style={styles.rectangle}
				colors={playerIconsGradient}
				locations={[0.1, 0.7, 1]}
				start={{ x: 0.9, y: 0.1 }}
			/>
			<LinearGradient
				style={styles.rectangle}
				colors={playerIconsGradient}
				locations={[0.2, 0.7, 1]}
				start={{ x: 0.9, y: 0.4 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	rectangle: {
		height: '80%',
		width: '25%',
		borderTopColor: Colors.colors.dark,
	},
});

export default PlayerMainButtonPauseIcon;
