import Layout from '../../constants/Layout';

export function getMainBtnContainerSize() {
	return Layout.window.height * (Layout.window.height < 900 ? 0.15 : 0.175);
}
