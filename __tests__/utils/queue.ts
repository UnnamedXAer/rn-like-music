import { getQueueOrder, shuffleQueue } from '../../utils/queue';

const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
test('should return shuffled array of indexes', () => {
	const shuffledQueue = shuffleQueue([...indexes]);

	expect(shuffledQueue).not.toEqual(indexes);
});

test('should queue order', () => {
	const queueLength = indexes.length;
	const notShuffledOrder = getQueueOrder(queueLength, false);
	expect(notShuffledOrder).toEqual(indexes);
	expect(notShuffledOrder.length).toBe(queueLength);

	const shuffledOrder = getQueueOrder(queueLength, true);
	expect(shuffledOrder).not.toEqual(indexes);
	expect(shuffledOrder.length).toBe(queueLength);
});
