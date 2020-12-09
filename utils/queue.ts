import Dir from '../models/dir';

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
	const indexes = new Array(queueLen).fill(0).map((_, i) => i);

	if (shouldShuffle) {
		shuffleQueue(indexes);
	}
	return indexes;
};

export function getCurrentTracks(
	currentTrack: Dir | null,
	queue: Dir[],
	queueOrder: number[],
): {
	currentTrack: Dir | null;
	nextTrack: Dir | null;
	prevTrack: Dir | null;
} {
	if (queue.length === 0) {
		return {
			currentTrack: null,
			nextTrack: null,
			prevTrack: null,
		};
	}
	let nextTrack: Dir | null = null;
	let prevTrack: Dir | null = null;
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
