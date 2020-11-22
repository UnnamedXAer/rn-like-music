export const secondsToMinutesString = (duration: number) => {
	const minutes = Math.floor(duration / 60);
	const seconds = +(duration - minutes * 60).toFixed();

	return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
};
