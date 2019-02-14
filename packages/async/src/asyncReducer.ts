import { AnyAction } from 'redux';
import { isAsyncAction, isAsyncPendingAction } from './asyncAction';
import { getAsyncActionKey } from './asyncActionKey';
import { AsyncState, AsyncStatusMap, AsyncTimestampMap } from './AsyncState';

/**
 * Updates async action status in the status map for each async action
 */
function asyncStatusMapReducer(
  state: AsyncStatusMap = {},
  action: AnyAction
): AsyncStatusMap {
  if (isAsyncAction(action)) {
    return {
      ...state,
      [getAsyncActionKey(action.type, action.params)]: action.async
    };
  }

  return state;
}

/**
 * Updates async action timestamp in the timestamp map for each async pending action
 */
function asyncTimestampMapReducer(
  state: AsyncTimestampMap = {},
  action: AnyAction
): AsyncTimestampMap {
  if (isAsyncPendingAction(action) && action.timestamp) {
    return {
      ...state,
      [getAsyncActionKey(action.type, action.params)]: action.timestamp
    };
  }

  return state;
}

/**
 * Reducer that keeps track of async statuses and timestamps. Should be mounted on the `async` key.
 */
export function asyncReducer(
  state: Partial<AsyncState> = {},
  action: AnyAction
): AsyncState {
  return {
    ...state,
    status: asyncStatusMapReducer(state.status, action),
    timestamp: asyncTimestampMapReducer(state.timestamp, action)
  };
}
