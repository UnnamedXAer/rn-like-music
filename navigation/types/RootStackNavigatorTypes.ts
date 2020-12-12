import { DirectoriesTabParamList } from './DirectoriesTabNavigatorTypes';
import { PlayScreenParamList } from './PlayerScreenNavigatorTypes';

// type DirectoriesParams = {
// 	[K in keyof DirectoriesTabParamList]: undefined extends DirectoriesTabParamList[K]
// 		? { screen: K; params?: DirectoriesTabParamList[K] }
// 		: { screen: K; params: DirectoriesTabParamList[K] };
// }[keyof DirectoriesTabParamList];

export type NestedNavigatorParams<ParamList> = {
	[K in keyof ParamList]: undefined extends ParamList[K]
		? { screen: K; params?: ParamList[K] }
		: { screen: K; params: ParamList[K] };
}[keyof ParamList];

export type RootStackParamList = {
	Play: PlayScreenParamList;
	Directories: NestedNavigatorParams<DirectoriesTabParamList>;
};
