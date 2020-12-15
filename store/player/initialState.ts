import { PlayerStoreState } from './types';

export const playerInitialState: PlayerStoreState = {
	initialized: false,
	currentTrack: null,
	isPlaying: false,
	random: false,
	repeat: false,
};
