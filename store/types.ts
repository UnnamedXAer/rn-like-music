import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { DirectoriesActions } from './directories/types';
import { PlayerActions } from './player/types';
import { QueueActions } from './queue/types';
import Reducer from './reducer';

export type RootState = ReturnType<typeof Reducer>;

export type SimpleReducer<TState, TAction> = (state: TState, action: TAction) => TState;

export type StoreActions = DirectoriesActions | PlayerActions | QueueActions;

// @thought: reversed order of R, A because of i mostly return void
export type ThunkResult<
	A extends Action = StoreActions,
	R = Promise<void> | void
> = ThunkAction<R, RootState, undefined, A>;
