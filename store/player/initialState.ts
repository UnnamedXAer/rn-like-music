import { PlayerStoreState } from './types';

export const playerInitialState: PlayerStoreState = {
	initialized: false,
	destroyed: false,
	currentTrack: null,
	isPlaying: false,
	random: false,
	repeat: false,
};
