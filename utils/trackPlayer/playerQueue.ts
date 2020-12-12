import Playable from '../../models/playable';
import { PlayerStoreState } from '../../store/player/types';
import { QueueStoreState } from '../../store/queue/types';

export function shuffleQueue(indexes: number[]) {
	let currentIdx = indexes.length;
	let temp: number;
	let index: number;

	while (currentIdx > 0) {
		index = Math.floor(Math.random() * currentIdx);
		currentIdx--;
		temp = indexes[currentIdx];
		indexes[currentIdx] = indexes[index];
		indexes[index] = temp;
	}
	return indexes;
}

export const getQueueOrder = (queueLen: number, shouldShuffle: boolean): number[] => {
	console.log('qetQueueOrder', queueLen);

	// @refactor
	const indexes = new Array(queueLen).fill(0).map((_, i) => i);

	if (shouldShuffle) {
		shuffleQueue(indexes);
	}
	return indexes;
};

export const getNextTrackInDirection = (
	direction: 'next' | 'previous',
	tracks: QueueStoreState['tracks'],
	currentTrack: PlayerStoreState['currentTrack'],
	random: PlayerStoreState['random'],
) => {
	if (direction === 'next') {
		const track = getNextTrack(tracks, currentTrack, random);
		return track;
	}
	const track = getPreviousTrack(tracks, currentTrack, random);
	return track;
};

export const getNextTrack = (
	tracks: QueueStoreState['tracks'],
	currentTrack: PlayerStoreState['currentTrack'],
	random: PlayerStoreState['random'],
): Playable | null => {
	if (tracks.length === 0) {
		return null;
	}

	// @refactor
	// ! @refactor
	// @refactor
	const { nextTrack } = getCurrentTracks(
		currentTrack,
		tracks,
		getQueueOrder(tracks.length, random),
	);

	return nextTrack;
};

export const getPreviousTrack = (
	tracks: QueueStoreState['tracks'],
	currentTrack: PlayerStoreState['currentTrack'],
	random: PlayerStoreState['random'],
): Playable | null => {
	if (tracks.length === 0) {
		return null;
	}

	// @refactor
	// ! @refactor
	// @refactor
	const { prevTrack } = getCurrentTracks(
		currentTrack,
		tracks,
		getQueueOrder(tracks.length, random),
	);

	return prevTrack;
};

export function getCurrentTracks(
	currentTrack: Playable | null,
	queue: Playable[],
	queueOrder: number[],
): {
	currentTrack: Playable | null;
	nextTrack: Playable | null;
	prevTrack: Playable | null;
} {
	if (queue.length === 0) {
		return {
			currentTrack: null,
			nextTrack: null,
			prevTrack: null,
		};
	}
	let nextTrack: Playable | null = null;
	let prevTrack: Playable | null = null;
	let _currentTrack =
		currentTrack === null ? queue[queueOrder[0]] : { ...currentTrack };

	let currTrackIdx = queue.findIndex((x) => x.path === _currentTrack.path);

	if (currTrackIdx === -1) {
		currTrackIdx = 0;
		_currentTrack = queue[queueOrder[0]];
	}

	const currentTrackIdxInOrder = queueOrder.indexOf(currTrackIdx);

	const nextTrackIdx =
		queueOrder[
			currentTrackIdxInOrder + 1 < queueOrder.length
				? currentTrackIdxInOrder + 1
				: 0
		];
	nextTrack = queue[nextTrackIdx];

	const prevTrackIdx =
		queueOrder[
			currentTrackIdxInOrder - 1 >= 0
				? currentTrackIdxInOrder - 1
				: queueOrder.length - 1
		];
	prevTrack = queue[prevTrackIdx];

	return {
		currentTrack: _currentTrack,
		nextTrack,
		prevTrack,
	};
}
