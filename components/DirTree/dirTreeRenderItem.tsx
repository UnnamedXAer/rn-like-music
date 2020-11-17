import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Layout from '../../constants/Layout';
import Dir from '../../models/dir';
import { Text } from '../UI/Themed';

interface Props {
	item: Dir;
	onDirPress: (dir: Dir) => Promise<void>;
	subDirectories: { [path: string]: Dir[] };
	selectedFiles: { [path: string]: Dir };
	color: string;
}

export default function RenderItem({
	item,
	onDirPress,
	subDirectories,
	selectedFiles,
	color,
}: Props) {
	const [isExpanded, setIsExpanded] = useState(false);

	let iconName = 'file';
	if (item.isDirectory) {
		if (isExpanded) {
			iconName = 'folder-open';
		} else {
			iconName = 'folder';
		}
	} else if (item.isFile) {
		if (/\.mp3/.test(item.name)) {
			iconName = 'music';
		}
	}

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
					<FontAwesome5 name={iconName} light size={16} />
					{/* {item.isDirectory ? (
						isExpanded ? (
							'-'
						) : (
							<FontAwesome5
								name="folder-open"
								size={Layout.spacing(3)}
								color={color}
								light
							/>
						)
					) : selectedFiles[item.path] ? (
						'[v]'
					) : (
						'[ ]'
					)}{' '} */}
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
								color={color}
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
