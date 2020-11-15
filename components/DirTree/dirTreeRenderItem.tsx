import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Dir from '../../models/dir';
import { Text } from '../UI/Themed';

interface Props {
	item: Dir;
	onDirPress: (dir: Dir) => Promise<void>;
	subDirectories: { [path: string]: Dir[] };
	selectedFiles: { [path: string]: Dir };
}

export default function RenderItem({
	item,
	onDirPress,
	subDirectories,
	selectedFiles,
}: Props) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<View style={[styles.container]}>
			<TouchableOpacity
				onPress={() => {
					onDirPress(item);
					if (item.isDirectory) {
						setIsExpanded((prevState) => !prevState);
					}
				}}>
				<Text>
					{item.isDirectory
						? isExpanded
							? '-'
							: '+'
						: selectedFiles[item.path]
						? '[v]'
						: '[ ]'}{' '}
					{item.isDirectory ? 'dir:' : item.isFile ? 'file:' : 'unknown type:'}{' '}
					{item.name}
				</Text>
			</TouchableOpacity>
			{isExpanded && subDirectories[item.path] && (
				<FlatList
					data={subDirectories[item.path]}
					keyExtractor={(_item) => _item.path}
					renderItem={({ item: subItem }) => {
						return (
							<RenderItem
								item={subItem}
								onDirPress={onDirPress}
								subDirectories={subDirectories}
								selectedFiles={selectedFiles}
							/>
						);
					}}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4,
		paddingLeft: 16,
		paddingRight: 8,
		borderBottomWidth: 1,
		borderColor: 'lightgreen',
	},
});
