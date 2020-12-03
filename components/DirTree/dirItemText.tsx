import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../../constants/Layout';
import Dir from '../../models/dir';
import { Text } from '../UI/Themed';
import DirIcon from './dirIcon';

interface Props {
	item: Dir;
	onPress: () => void;
	onLongPress: () => void;
	color: string;
	isSelected: boolean;
}

const DirItemText: React.FC<Props> = ({
	onPress,
	onLongPress,
	item,
	color,
	isSelected,
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.touchable}
			onLongPress={onLongPress}>
			<>
				<DirIcon dir={item} color={color} isSelected={isSelected} />
				<Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
					{item.name}
				</Text>
			</>
		</TouchableOpacity>
	);
};

export default DirItemText;

const styles = StyleSheet.create({
	touchable: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		flex: 1,
		fontSize: Layout.spacing(2.5),
	},
});
