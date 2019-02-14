import { AnyAction, Reducer } from 'redux';
import {
  AsyncAction,
  isAsyncAction,
  isAsyncPendingAction,
  isAsyncRejectedAction,
  isAsyncResolvedAction
} from './asyncAction';

/**
 * Higher order reducer that handles async pending actions of given type.
 */
export function handlePending<
  TState,
  TAction extends AsyncAction<any, any> = AsyncAction<unknown, unknown>
>(
  type: string,
  reducer: Reducer<TState, TAction['Pending']>,
  initialState: TState
): Reducer<TState, AnyAction> {
  return (state: TState = initialState, action: AnyAction) =>
    action.type === type && isAsyncPendingAction(action)
      ? reducer(state, action)
      : state;
}

/**
 * Higher order reducer that handles async resolved actions of given type.
 */
export function handleResolved<
  TState,
  TAction extends AsyncAction<any, any> = AsyncAction<unknown, unknown>
>(
  type: string,
  reducer: Reducer<TState, TAction['Resolved']>,
  initialState: TState
): Reducer<TState, AnyAction> {
  return (state: TState = initialState, action: AnyAction) =>
    action.type === type && isAsyncResolvedAction(action)
      ? reducer(state, action)
      : state;
}

/**
 * Higher order reducer that handles async rejected actions of given type.
 */
export function handleRejected<
  TState,
  TAction extends AsyncAction<any, any> = AsyncAction<unknown, unknown>
>(
  type: string,
  reducer: Reducer<TState, TAction['Rejected']>,
  initialState: TState
): Reducer<TState, AnyAction> {
  return (state: TState = initialState, action: AnyAction) =>
    action.type === type && isAsyncRejectedAction(action)
      ? reducer(state, action)
      : state;
}

/**
 * Type of object that contains reducers for async actions.
 */
type AsyncReducersMap<
  TState,
  TAction extends AsyncAction<any, any> = AsyncAction<unknown, unknown>
> = {
  pending?: Reducer<TState, TAction['Pending']>;
  resolved?: Reducer<TState, TAction['Resolved']>;
  rejected?: Reducer<TState, TAction['Rejected']>;
};

/**
 * Higher order reducer that handles async actions of given type.
 */
export function handleAsync<
  TState,
  TAction extends AsyncAction<any, any> = AsyncAction<unknown, unknown>
>(
  type: string,
  reducers: AsyncReducersMap<TState, TAction>,
  initialState: TState
): Reducer<TState, AnyAction> {
  return (state: TState = initialState, action: AnyAction) => {
    if (action.type !== type || !isAsyncAction(action)) {
      return state;
    }

    if (reducers.pending && isAsyncPendingAction(action)) {
      return reducers.pending(state, action);
    } else if (reducers.resolved && isAsyncResolvedAction(action)) {
      return reducers.resolved(state, action);
    } else if (reducers.rejected && isAsyncRejectedAction(action)) {
      return reducers.rejected(state, action);
    }

    return state;
  };
}
