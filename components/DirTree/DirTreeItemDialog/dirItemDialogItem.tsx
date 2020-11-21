import React from 'react';
import { TouchableHighlight } from 'react-native';
import { Text } from '../../UI/Themed';

interface Props {
	title: string;
	onPress: () => void;
}

const DirItemDialogItem: React.FC<Props> = ({ onPress, title }) => {
	return (
		<TouchableHighlight onPress={onPress}>
			<Text>{title}</Text>
		</TouchableHighlight>
	);
};

export default DirItemDialogItem;
