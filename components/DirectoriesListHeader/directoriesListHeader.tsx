import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Layout from '../../constants/Layout';
import { View as ThemedView, Text as ThemedText } from '../UI/Themed';

interface Props {
	onPress: (path: string) => void;
	currentPath: string;
}

const DirectoriesListHeader: React.FC<Props> = ({ onPress, currentPath }) => {
	const pathParts = currentPath.split('/');
	return (
		<ThemedView style={styles.container}>
			<View style={styles.containerOverlay} />
			<ScrollView horizontal>
				{pathParts.map((path, idx) => (
					<TouchableOpacity
						style={styles.touchable}
						onPress={() => {
							const relativePath = [];
							for (let i = 0; i <= idx; i++) {
								relativePath.push(pathParts[i]);
							}
							console.log('relativePath:', relativePath.join('/'));
							onPress(relativePath.join('/'));
						}}>
						<ThemedText style={[styles.text]}>
							{path.length > 20 ? path.substr(0, 20) + '...' : path}{' '}
							<FontAwesome5Icon name="chevron-right" />
						</ThemedText>
					</TouchableOpacity>
				))}
			</ScrollView>
		</ThemedView>
	);
};

export default DirectoriesListHeader;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: Layout.spacing(2),
		flexDirection: 'row',
		position: 'relative',
	},
	containerOverlay: {
		backgroundColor: '#000',
		opacity: 0.2,
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		// width: '100%',
	},
	touchable: {
		paddingVertical: Layout.spacing(),
		paddingHorizontal: Layout.spacing(0.5),
	},
	text: {
		fontSize: Layout.spacing(2),
	},
});