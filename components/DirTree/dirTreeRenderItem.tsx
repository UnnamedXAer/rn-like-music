import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../../constants/Layout';
import Dir from '../../models/dir';
import Playable from '../../models/playable';
import MenuVerticalButton from '../UI/menuVerticalButton';
import DirItemText from './dirItemText';

interface Props {
	item: Dir | Playable;
	onDirPress: () => void;
	onDirLongPress: () => void;
	color: string;
	isSelected: boolean;
}

export default function DirRenderItem({
	item,
	onDirPress,
	onDirLongPress,
	color,
	isSelected,
}: Props) {
	return (
		<View style={[styles.container]}>
			<DirItemText
				onPress={onDirPress}
				onLongPress={onDirLongPress}
				color={color}
				item={item}
				isSelected={isSelected}
			/>
			<MenuVerticalButton onPress={onDirLongPress} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingVertical: Layout.spacing(0.5),
		paddingLeft: Layout.spacing(1.5),
	},
});
