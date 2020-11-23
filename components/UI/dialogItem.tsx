import React from 'react';
import { TouchableHighlight } from 'react-native';
import { Text } from './Themed';

interface Props {
	title: string;
	onPress: () => void;
}

const DialogItem: React.FC<Props> = ({ onPress, title }) => {
	return (
		<TouchableHighlight onPress={onPress}>
			<Text>{title}</Text>
		</TouchableHighlight>
	);
};

export default DialogItem;
