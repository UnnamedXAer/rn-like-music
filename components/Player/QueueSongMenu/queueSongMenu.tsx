import React from 'react';
import Dialog, { DialogData } from '../../UI/Dialog';
import DialogItem from '../../UI/dialogItem';

export type QueueSongOptionsOption = 'PLAY' | 'REMOVE_FROM_QUEUE' | 'SHOW_INFO';

interface Props {
	visible: boolean;
	onItemPress: (action: QueueSongOptionsOption) => void;
	onPressOutside: DialogData['onPressOutside'];
}

const QueueSongMenu: React.FC<Props> = ({ visible, onPressOutside, onItemPress }) => {
	return (
		<Dialog
			onPressOutside={onPressOutside}
			isVisible={visible}
			title={'What to do?'}
			content={
				<>
					<DialogItem
						onPress={() => onItemPress('PLAY')}
						title="Play"
						iconName="play"
					/>
					<DialogItem
						onPress={() => onItemPress('REMOVE_FROM_QUEUE')}
						title="Remove from queue"
						iconName="minus"
					/>
					<DialogItem
						onPress={() => onItemPress('SHOW_INFO')}
						title="Show file details"
						iconName="info-circle"
					/>
				</>
			}
			actions={{
				onPress: onPressOutside,
				title: 'Dismiss',
			}}
		/>
	);
};

export default QueueSongMenu;
