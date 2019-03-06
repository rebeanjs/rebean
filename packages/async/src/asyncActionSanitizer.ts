import {
  isAsyncAction,
  isAsyncPendingAction,
  isAsyncRejectedAction,
  isAsyncResolvedAction
} from './asyncAction';
import { getAsyncActionKey } from './asyncActionKey';

/**
 * Marks async status in Redux Devtools - adds icon after action type
 */
function asyncActionStatusMarker(action: any): any {
  if (isAsyncPendingAction(action)) {
    return { ...action, type: `${action.type} ●` };
  }
  if (isAsyncRejectedAction(action)) {
    return { ...action, type: `${action.type} ✔︎️` };
  }
  if (isAsyncResolvedAction(action)) {
    return { ...action, type: `${action.type} ✖︎` };
  }

  return action;
}

/**
 * Marks async parameters in Redux Devtools - adds parameters string after action type
 */
function asyncActionParamsMarker(action: any): any {
  if (isAsyncAction(action) && action.params) {
    return { ...action, type: getAsyncActionKey(action.type, action.params) };
  }

  return action;
}

/**
 * Options for async action sanitizer for Redux Devtools
 */
export interface AsyncActionSanitizerOptions {
  markStatus?: boolean;
  showParams?: boolean;
}

const defaultSanitizerOptions: AsyncActionSanitizerOptions = {
  markStatus: true,
  showParams: true
};

/**
 * Improves development experience by marking async actions in Redux Devtools.
 */
export function asyncActionSanitizer(options?: AsyncActionSanitizerOptions) {
  options = {
    ...defaultSanitizerOptions,
    ...(options || {})
  };

  return (action: any): any => {
    if (options!.showParams) {
      action = asyncActionParamsMarker(action);
    }
    if (options!.markStatus) {
      action = asyncActionStatusMarker(action);
    }

    return action;
  };
}
