import React from 'react';
import { StyleSheet, View } from 'react-native';

const DirItemSeparator = () => {
	return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
	separator: {
		height: 1,
		backgroundColor: '#ccc',
		marginHorizontal: '10%',
	},
});

export default DirItemSeparator;
