import Dir from '../../models/dir';

export enum PlayerActionTypes {
	SetCurrentTrack = 'PLAYER_SET_CURRENT_TRACK',
	ToggleFlag = 'PLAYER_TOGGLE_FLAG',
	SetIsPlaying = 'PLAYER_SET_IS_PLAYING',
}

export type PlayerFlag = 'repeat' | 'random';

export type PlayerStoreState = {
	readonly currentTrack: Dir | null;
	readonly isPlaying: boolean;
} & {
	readonly [K in PlayerFlag]: boolean;
};

export type PlayerActionPayload = {
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

export type PlayerActions =
	| SetIsPlayingAction
	| SetCurrentTrackAction
	| TogglePlayerParameter;
