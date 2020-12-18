import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Layout from '../constants/Layout';
import { DirStat } from '../models/dirStat';
import { formatDirSize } from '../utils/units';
import Dialog from './UI/Dialog';
import Separator from './UI/Separator';
import { Text } from './UI/Themed';

interface Props {
	onDismiss: () => void;
	info: DirStat | null;
}

export default function DirInfoDialog({ onDismiss, info: dirInfo }: Props) {
	return (
		<Dialog
			isVisible={dirInfo !== null}
			onPressOutside={onDismiss}
			title={'Info'}
			content={
				dirInfo ? (
					<View style={styles.container}>
						{Row('Name:', dirInfo.name)}
						<Separator />
						{Row('Type:', dirInfo.type)}
						<Separator />
						{Row('Size:', formatDirSize(dirInfo.size))}
					</View>
				) : (
					<ActivityIndicator />
				)
			}
			actions={{ onPress: onDismiss, title: 'Dismiss' }}
		/>
	);
}

const Row = (label: string, value: string | number) => (
	<View style={styles.row}>
		<View style={styles.rowHeader}>
			<Text style={styles.rowHeaderText}>{label}</Text>
		</View>
		<View style={styles.rowValue}>
			<Text style={styles.rowValueText} numberOfLines={3} ellipsizeMode="middle">
				{value}
			</Text>
		</View>
	</View>
);

const styles = StyleSheet.create({
	container: {},
	row: {
		flexDirection: 'row',
		marginVertical: Layout.spacing(1),
	},
	rowHeader: {
		alignItems: 'flex-end',
		marginRight: Layout.spacing(2),
		width: 50,
	},
	rowHeaderText: {
		fontWeight: 'bold',
	},
	rowValue: {
		flexDirection: 'row',
		flexShrink: 1,
	},
	rowValueText: {
		flexWrap: 'wrap',
		flexShrink: 1,
	},
});
