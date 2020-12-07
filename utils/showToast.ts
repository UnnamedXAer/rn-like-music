import { Alert, Platform, ToastAndroid } from 'react-native';
import { ShowToastOptions } from '../types/types';

/**
 * Show message as Toast on Android or Alert otherwise.
 *
 * @param {string} message - string
 * @param {string} devMessage - string
 * @param {string} [duration = (__DEV__ ? ToastAndroid.LONG : ToastAndroid.SHORT)] - number / ignored if not Android
 * @example
 * - showToast('Already done.');
 * - showToast('Already done.', 'Executed in 12ms');
 * - showToast('Already done.', 'Executed in 12ms', 'LONG');
 */
function showToast(
	message: string,
	devMessage?: string,
	duration?: 'SHORT' | 'LONG',
): void;

/**
 * Show message as Toast on Android or Alert otherwise.
 *
 * @param {ShowToastOptions} messageOptions
 * @example
 * showToast({
 * 	message: 'Internal error',
 * 	devMessage: error.message,
 * 	duration: "SHORT"
 * });
 */
function showToast(messageOptions: ShowToastOptions): void;

function showToast(...args: any): void {
	const { message, devMessage, duration } = getToastArgs(...args);

	if (Platform.OS === 'android') {
		return ToastAndroid.show(
			message + (devMessage && __DEV__ ? ' | ' + devMessage : ''),
			ToastAndroid[__DEV__ ? 'LONG' : duration || 'SHORT'],
		);
	}
	return Alert.alert('', message + (devMessage && __DEV__ ? ' | ' + devMessage : ''));
}

function getToastArgs(...args: any): ShowToastOptions {
	if (typeof args[0] === 'string') {
		const [message, devMessage, duration] = args;
		return { message, devMessage, duration };
	}
	return args[0];
}

export default showToast;
