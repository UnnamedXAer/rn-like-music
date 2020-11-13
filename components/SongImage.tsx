import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { MonoText } from './UI/StyledText';

interface Props {
	bgImg?: string;
	songTitle: string;
}

export default function SongImage({ songTitle, bgImg }: Props) {
	return (
		<View style={styles.container}>
			<ImageBackground
				source={{
					uri: bgImg,
				}}
				style={styles.imageBackground}
				resizeMode="cover"
				borderRadius={Layout.baseRadius - 1}>
				<View style={styles.titleMask}>
					<MonoText style={[styles.title, { opacity: 0 }]}>
						{songTitle}
						{songTitle}
					</MonoText>
				</View>
				<View style={styles.titleContainer}>
					<MonoText ellipsizeMode="tail" style={styles.title}>
						{songTitle}
						{songTitle}
					</MonoText>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: Layout.window.height / 4 + 32,
		borderColor: Colors.colors.dark,
		borderWidth: 1,
		borderRadius: Layout.baseRadius,
		overflow: 'hidden',
		marginBottom: 16,
		elevation: Layout.baseRadius,
	},
	imageBackground: {
		position: 'relative',
		flex: 1,
	},
	titleMask: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		opacity: 0.6,
		paddingBottom: 8,
		paddingTop: 8,
	},
	titleContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingBottom: 8,
		paddingTop: 8,
	},
	title: {
		fontSize: 20,
		textAlign: 'center',
		maxWidth: '100%',
		color: Colors.light.text,
	},
});
