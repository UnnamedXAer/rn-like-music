import Playable from '../../models/playable';

export enum PlayerActionTypes {
	SetPlayerInitialized = 'PLAYER_SET_INITIALIZED',
	SetPlayerDestroyed = 'PLAYER_SET_DESTROYED',
	SetCurrentTrack = 'PLAYER_SET_CURRENT_TRACK',
	ToggleFlag = 'PLAYER_TOGGLE_FLAG',
	SetIsPlaying = 'PLAYER_SET_IS_PLAYING',
}

export type PlayerFlag = 'repeat' | 'random';

export type PlayerStoreState = {
	readonly initialized: boolean;
	readonly destroyed: boolean;
	readonly currentTrack: Playable | null;
	readonly isPlaying: boolean;
} & {
	readonly [K in PlayerFlag]: boolean;
};

export type PlayerActionPayload = {
	[PlayerActionTypes.SetPlayerInitialized]: PlayerStoreState['initialized'];
	[PlayerActionTypes.SetPlayerDestroyed]: PlayerStoreState['destroyed'];
	[PlayerActionTypes.SetCurrentTrack]: PlayerStoreState['currentTrack'] | null;
	[PlayerActionTypes.ToggleFlag]: PlayerFlag;
	[PlayerActionTypes.SetIsPlaying]: PlayerStoreState['isPlaying'];
};

export interface SetIsPlayingAction {
	type: PlayerActionTypes.SetIsPlaying;
	payload: PlayerActionPayload[PlayerActionTypes.SetIsPlaying];
}
export interface TogglePlayerParameter {
	type: PlayerActionTypes.ToggleFlag;
	payload: PlayerActionPayload[PlayerActionTypes.ToggleFlag];
}

export interface SetCurrentTrackAction {
	type: PlayerActionTypes.SetCurrentTrack;
	payload: PlayerActionPayload[PlayerActionTypes.SetCurrentTrack];
}
export interface SetPlayerInitializedAction {
	type: PlayerActionTypes.SetPlayerInitialized;
	payload: PlayerActionPayload[PlayerActionTypes.SetPlayerInitialized];
}
export interface SetPlayerDestroyedAction {
	type: PlayerActionTypes.SetPlayerDestroyed;
	payload: PlayerActionPayload[PlayerActionTypes.SetPlayerDestroyed];
}

export type PlayerActions =
	| SetPlayerInitializedAction
	| SetPlayerDestroyedAction
	| SetIsPlayingAction
	| SetCurrentTrackAction
	| TogglePlayerParameter;
