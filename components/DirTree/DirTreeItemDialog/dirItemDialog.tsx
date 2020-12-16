import React from 'react';
import Dialog, { DialogData } from '../../UI/Dialog';
import DialogItem from '../../UI/dialogItem';

export type DirDialogOptions = 'PLAY' | 'ADD_TO_QUEUE' | 'SHOW_INFO';

interface Props {
	visible: boolean;
	onItemPress: (action: DirDialogOptions) => void;
	onPressOutside: DialogData['onPressOutside'];
}

const DirItemDialog: React.FC<Props> = ({ visible, onPressOutside, onItemPress }) => {
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
						iconName="play-circle-outline"
						iconVendor="MaterialIcons"
					/>
					<DialogItem
						onPress={() => onItemPress('ADD_TO_QUEUE')}
						title="Add to Queue"
						iconName="queue-play-next"
						iconVendor="MaterialIcons"
					/>
					<DialogItem
						onPress={() => onItemPress('SHOW_INFO')}
						title="Show file details"
						iconName="info-outline"
						iconVendor="MaterialIcons"
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

export default DirItemDialog;
