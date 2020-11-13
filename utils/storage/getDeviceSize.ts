import { Dimensions } from 'react-native';
import { DeviceSize } from '../Types/types';

export default function getDeviceSize(): DeviceSize {
	const width = Dimensions.get('window').width;
	if (width < 340) return 'small';
	if (width < 440) return 'medium';
	if (width < 660) return 'large';
	return 'tablet';
}
