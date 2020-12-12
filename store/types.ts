import Reducer from './reducer';

export type RootState = ReturnType<typeof Reducer>;

export type SimpleReducer<TState, TAction> = (state: TState, action: TAction) => TState;
