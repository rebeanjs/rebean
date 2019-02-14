import { Middleware } from 'redux';
import { isAsyncAction, isAsyncActionAfter } from './asyncAction';
import { getAsyncTimestamp } from './asyncSelector';

/**
 * Redux middleware that blocks actions that are not in proper chronology (to prevent race conditions)
 */
export function asyncMiddleware(): Middleware {
  return ({ dispatch, getState }) => next => action => {
    if (!isAsyncAction(action)) {
      // pass non-async actions
      return next(action);
    }

    const timestamp = getAsyncTimestamp(action.type, action.params)(getState());
    const isAfter = isAsyncActionAfter(action, timestamp);

    if (isAfter || isAfter === undefined) {
      // pass async action if is in order or if it's impossible to detect
      return next(action);
    }

    // block async actions not in order (race condition)
  };
}
