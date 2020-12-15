import { Dimensions } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
import getDeviceSize from '../utils/getDeviceSize';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Layout = {
	window: {
		width,
		height,
	},
	deviceSize: getDeviceSize(),
	baseRadius: 4,
	spacing: (x = 1) => x * 8,
};
// (async () => {
// 	console.log('Device:', await DeviceInfo.getDeviceName());
// 	console.log('Layout', Layout);
// })();

export default Layout;
