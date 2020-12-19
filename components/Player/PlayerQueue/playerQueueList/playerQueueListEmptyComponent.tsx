import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../../constants/Colors';

interface Props {
	onPress: () => void;
}

const PlayerQueueListEmptyComponent = ({ onPress }: Props) => {
	return (
		<TouchableOpacity style={styles.notTracksContainer} onPress={onPress}>
			<FontAwesome5Icon name="music" color={Colors.colors.normal} size={55} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	notTracksContainer: {
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default PlayerQueueListEmptyComponent;
