import { PlayerStoreState } from './types';

export const playerInitialState: PlayerStoreState = {
	initialized: false,
	destroyed: true,
	currentTrack: null,
	isPlaying: false,
	random: false,
	repeat: true,
};
