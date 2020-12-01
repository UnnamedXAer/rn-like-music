import { MainDirType } from '../types/types';

class MainDir {
	constructor(public path: string, public name: string, public type: MainDirType) {}
}

export default MainDir;
