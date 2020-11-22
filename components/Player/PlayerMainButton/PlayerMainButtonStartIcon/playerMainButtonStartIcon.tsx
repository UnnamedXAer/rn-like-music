import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors, { playerIconsGradient } from '../../../../constants/Colors';

interface Props {
	containerSize: number;
}

const PlayerMainButtonStartIcon: React.FC<Props> = ({ containerSize }) => {
	return (
		<LinearGradient
			style={{
				width: containerSize / 1.8,
				height: containerSize / 1.8,
			}}
			colors={playerIconsGradient}
			locations={[0.2, 0.7, 1]}
			start={{ x: 0.7, y: 0.3 }}>
			<View
				style={[
					styles.triangle,
					{
						borderLeftWidth: containerSize / 1.8,
						borderTopWidth: containerSize / 1.8 / 2,
					},
				]}
			/>
			<View
				style={[
					styles.triangle,
					{
						borderLeftWidth: containerSize / 1.8,
						borderTopWidth: containerSize / 1.8 / 2,
						transform: [{ rotateX: '180deg' }],
					},
				]}
			/>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	triangle: {
		width: 0,
		height: 0,
		borderStyle: 'solid',
		backgroundColor: 'transparent',
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: Colors.colors.dark,
	},
});

export default PlayerMainButtonStartIcon;
