import React from 'react';
import { View } from 'react-native';
import Layout from '../../../../constants/Layout';
import { TracksState } from '../../../../context/tracksContext';
import { Text } from '../../../UI/Themed';

interface Props {
	track: TracksState['nextTrack'];
	direction: 'next' | 'previous';
}

export default function PlayerSkipButtonSongName({ direction, track }: Props) {
	return (
		<View
			style={{
				// width: '50%',
				borderWidth: 1,
				borderColor: 'pink',
				paddingRight:
					direction === 'previous'
						? 0
						: Layout.spacing(Layout.deviceSize === 'tablet' ? 1 : 0.5),
				paddingLeft: direction === 'previous' ? 4 : 0,
			}}>
			<Text /* TODO: font */
				numberOfLines={1}
				ellipsizeMode="tail"
				style={{
					textAlign: direction === 'previous' ? 'left' : 'right',
					fontSize:
						Layout.deviceSize === 'tablet'
							? 24
							: Layout.deviceSize === 'small'
							? 10
							: 12,
				}}>
				{track ? track.title : '-'}
			</Text>
		</View>
	);
}
