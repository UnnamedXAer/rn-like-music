import Playable from '../../models/playable';

export enum QueueActionTypes {
	SetTracks = 'QUEUE_SET_TRACKS',
}

export interface QueueStoreState {
	readonly tracks: Playable[];
}

export type QueueActionPayload = {
	[QueueActionTypes.SetTracks]: QueueStoreState['tracks'];
};

export interface SetTracks {
	type: QueueActionTypes.SetTracks;
	payload: QueueActionPayload[typeof QueueActionTypes.SetTracks];
}

export type QueueActions = SetTracks;
