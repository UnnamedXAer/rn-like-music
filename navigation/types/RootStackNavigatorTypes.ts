import { DirectoriesTabParamList } from './DirectoriesTabNavigatorTypes';

export type RootStackParamList = {
	Play: PlayScreenParamList;
	Directories: DirectoriesTabParamList;
};

export type PlayScreenParamList = { queueUpdated: boolean } | undefined;
