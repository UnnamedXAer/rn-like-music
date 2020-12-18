const kB = 1024;
const mB = kB * kB;
const gB = mB * kB;

export function formatDirSize(size: number) {
	if (size < 0) {
		return '-';
	}
	if (size < kB) {
		return size + ' B';
	}
	if (size < mB) {
		return round(size / kB) + ' KB';
	}
	if (size < gB) {
		return round(size / mB) + ' MB';
	}
	return round(size / gB) + ' GB';
}

const round = (num: number) => +num.toFixed(1);
