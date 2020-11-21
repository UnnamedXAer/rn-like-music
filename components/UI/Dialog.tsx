import React from 'react';
import Modal from 'react-native-modal';
import Layout from '../../constants/Layout';
import Button from './Button';
import Separator from './Separator';
import { Text, View } from './Themed';

export type DialogAction = {
	title: string;
	onPress: () => void;
	color?: string;
};

export type DialogData = {
	title?: string;
	isVisible: boolean;
	onPressOutside: () => void;
	actions?: DialogAction | DialogAction[];
	content: React.ReactNode;
};

interface Props extends DialogData {}

const Dialog: React.FC<Props> = ({
	title,
	isVisible,
	onPressOutside,
	content,
	actions,
}) => {
	return (
		<Modal isVisible={isVisible} onBackdropPress={onPressOutside}>
			<View style={{ padding: Layout.spacing(2) }}>
				{title ? (
					<>
						<Text
							style={{ fontSize: Layout.spacing(2.5), fontWeight: '700' }}>
							{title}
						</Text>
						<Separator />
					</>
				) : null}
				{content}
				{actions ? (
					<>
						<Separator />
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-end',
							}}>
							{(Array.isArray(actions) ? actions : [actions]).map(
								(action) => (
									<Button
										key={action.title}
										onPress={() => {
											action.onPress();
										}}
										title={action.title}
										size="small"
										mode="text"
										color={action.color}
									/>
								),
							)}
						</View>
					</>
				) : null}
			</View>
		</Modal>
	);
};

export default Dialog;
