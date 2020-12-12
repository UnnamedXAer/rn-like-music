import { PLAYABLE_FILE_EXTENSIONS } from '../../constants/strings';
import Playable from '../../models/playable';

export const isFilePlayable = (fileName: Playable['name']) => {
	const nameParts = fileName.split('.');
	const ext = nameParts[nameParts.length - 1];
	if (ext === '') {
		return false;
	}
	return PLAYABLE_FILE_EXTENSIONS.includes(ext);
};
