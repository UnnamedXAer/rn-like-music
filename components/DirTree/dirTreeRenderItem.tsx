import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../../constants/Layout';
import Dir from '../../models/dir';
import DirItemText from './dirItemText';

interface Props {
	item: Dir;
	onDirPress: (dir: Dir) => void;
	onDirLongPress: (dir: Dir) => void;
	loading: boolean | undefined;
	color: string;
}

export default function DirRenderItem({
	item,
	onDirPress,
	onDirLongPress,
	loading,
	color,
}: Props) {
	return (
		<View style={[styles.container]}>
			<DirItemText
				onPress={() => {
					onDirPress(item);
				}}
				onLongPress={() => {
					onDirLongPress(item);
				}}
				loading={loading}
				color={color}
				item={item}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: Layout.spacing(0.5),
		paddingLeft: Layout.spacing(1.5),
	},
});
