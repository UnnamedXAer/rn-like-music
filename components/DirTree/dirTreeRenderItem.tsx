import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Layout from '../../constants/Layout';
import Dir from '../../models/dir';
import DirItemSeparator from './dirItemSeparator';
import DirItemText from './dirItemText';

interface Props {
	item: Dir;
	onDirPress: (dir: Dir) => Promise<void>;
	subDirectories: { [path: string]: Dir[] };
	loadingDirs: { [path: string]: boolean };
	selectedFiles: { [path: string]: Dir };
	color: string;
}

export default function DirRenderItem({
	item,
	onDirPress,
	subDirectories,
	loadingDirs,
	selectedFiles,
	color,
}: Props) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<View style={[styles.container]}>
			<DirItemText
				onPress={() => {
					onDirPress(item);
					if (item.isDirectory) {
						setIsExpanded((prevState) => !prevState);
					}
				}}
				loading={loadingDirs[item.path]}
				color={color}
				isExpanded={isExpanded}
				item={item}
			/>
			{isExpanded && subDirectories[item.path] && (
				<FlatList
					data={subDirectories[item.path]}
					keyExtractor={(_item) => _item.path}
					ItemSeparatorComponent={() => <DirItemSeparator />}
					renderItem={({ item: subItem }) => {
						return (
							<DirRenderItem
								loadingDirs={loadingDirs}
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
		paddingVertical: Layout.spacing(0.5),
		paddingLeft: Layout.spacing(1.5),
	},
});
