import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Layout from '../../constants/Layout';
import Dir from '../../models/dir';

interface Props {
	dir: Dir;
	isExpanded: boolean;
	loading: boolean | undefined;
	color: string;
}

const DirIcon: React.FC<Props> = ({ dir, isExpanded, loading, color }) => {
	let iconName = 'file';
	if (dir.isDirectory) {
		if (isExpanded) {
			iconName = 'folder-open';
		} else {
			iconName = 'folder';
		}
	} else if (dir.isFile) {
		if (/\.mp3/.test(dir.name)) {
			iconName = 'music';
		}
	}
	console.log('loading', loading);
	return (
		<View style={styles.container}>
			<FontAwesome5
				name={iconName}
				light
				size={Layout.spacing(3)}
				color={color}
				style={{
					opacity: loading ? 0.3 : 1,
				}}
			/>
			{loading && (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size={Layout.spacing(3)} color={'blue'} />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		padding: Layout.spacing(1),
		marginRight: Layout.spacing(1),
	},
	loadingContainer: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		opacity: 0.8,
	},
});

export default DirIcon;
