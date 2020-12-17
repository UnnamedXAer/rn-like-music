import Playable from '../../models/playable';

export enum QueueActionTypes {
	SetTracks = 'QUEUE_SET_TRACKS',
	RemoveTrack = 'QUEUE_REMOVE_TRACK',
}

export interface QueueStoreState {
	readonly tracks: Playable[];
}

export type QueueActionPayload = {
	[QueueActionTypes.SetTracks]: QueueStoreState['tracks'];
};

export interface QueueSetTracksAction {
	type: QueueActionTypes.SetTracks;
	payload: QueueActionPayload[typeof QueueActionTypes.SetTracks];
}

export type QueueActions = QueueSetTracksAction;
