export type DeviceSize = 'small' | 'medium' | 'large' | 'tablet';
export type PlayerAction = 'play' | 'pause' | 'stop';

export type ShowToastOptions = {
	message: string;
	devMessage?: any;
	duration?: 'SHORT' | 'LONG';
};

export type MainDir = {
	path: string;
	name: string;
	type: 'disk' | 'folder';
};

export type GlobalDirs = MainDir[];
