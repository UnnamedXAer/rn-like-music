import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Dir from '../../models/dir';

interface Props {
	item: Dir;
	onDirPress: (dir: Dir) => Promise<void>;
	subDirectories: { [key: string]: Dir[] };
}

export default function RenderItem({ item, onDirPress, subDirectories }: Props) {
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
					{item.isDirectory ? (isExpanded ? '-' : '+') : '|>'}{' '}
					{item.isDirectory
						? `dir: ${item.name}`
						: item.isFile
						? `file: ${item.path}`
						: `unknown type: ${item.path}`}
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
