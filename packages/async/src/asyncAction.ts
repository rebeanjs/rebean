import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAsyncActionCreator } from './asyncActionCreator';
import { AsyncActionParams } from './AsyncActionParams';
import { AsyncMountedState } from './AsyncState';
import { AsyncStatus } from './AsyncStatus';

/**
 * Flux Standard Action
 * @see https://github.com/redux-utilities/flux-standard-action
 * Instead of setting payload and meta as optional (because they are not required),
 * we use default generic type as undefined. Thanks to this typed actions assumes
 * that we pass payload and/or meta as we declare (we can pass undefined type).
 */
interface FluxStandardAction<TPayload = undefined, TMeta = undefined>
  extends Action {
  payload: TPayload;
  meta: TMeta;
  error?: boolean;
}

/**
 * Action that is aware of its chronology.
 * It uses "timestamp" field to keep track of some chronological order.
 */
interface ChronologyAwareAction extends Action {
  timestamp?: number;
}

/**
 * Async action that informs about pending status.
 * Payload of this action is an optimistic payload
 * (for example we can drag and drop item before we will get confirmation from backend that d&d operation succeed)
 */
export interface AsyncPendingAction<
  TOptimisticPayload = undefined,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
> extends FluxStandardAction<TOptimisticPayload, TMeta>, ChronologyAwareAction {
  async: AsyncStatus.PENDING;
  params: Partial<TParams>;
}

/**
 * Async action that informs about resolved status.
 */
export interface AsyncResolvedAction<
  TPayload = undefined,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
> extends FluxStandardAction<TPayload, TMeta>, ChronologyAwareAction {
  async: AsyncStatus.RESOLVED;
  params: Partial<TParams>;
}

/**
 * Async action that informs about rejected status. We use "error" flag because of compatibility with FSA.
 * There is no TPayload type, because it's hard to define type of error (as it can be thrown from any place of an application)
 */
export interface AsyncRejectedAction<
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
> extends FluxStandardAction<any, TMeta>, ChronologyAwareAction {
  async: AsyncStatus.REJECTED;
  params: Partial<TParams>;
  error: true;
}

/**
 * Type that describes three possible sub-types - uses a little bit hacky way to group types.
 */
export type AsyncAction<
  TPayload = undefined,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
> = {
  Pending: AsyncPendingAction<TPayload, TMeta, TParams>;
  Resolved: AsyncResolvedAction<TPayload, TMeta, TParams>;
  Rejected: AsyncRejectedAction<TMeta, TParams>;
};

/**
 * General type of async action - it's just pending, resolved or rejected async action.
 */
export type AnyAsyncAction<
  TPayload = any,
  TMeta = any,
  TParams extends AsyncActionParams = AsyncActionParams
> =
  | AsyncPendingAction<TPayload, TMeta, TParams>
  | AsyncResolvedAction<TPayload, TMeta, TParams>
  | AsyncRejectedAction<TMeta, TParams>;

/**
 * Checks if action is type of AsyncAction.
 */
export function isAsyncAction(
  action: any
): action is AnyAsyncAction<unknown, unknown> {
  return !!(
    action &&
    action.type &&
    action.async &&
    AsyncStatus.isValid(action.async)
  );
}

/**
 * Checks if action is type of AsyncPendingAction
 */
export function isAsyncPendingAction<
  TOptimisticPayload = unknown,
  TMeta = unknown
>(action: any): action is AsyncPendingAction<TOptimisticPayload, TMeta> {
  return isAsyncAction(action) && action.async === AsyncStatus.PENDING;
}

/**
 * Checks if action is type of AsyncResolvedAction
 */
export function isAsyncResolvedAction<TPayload = unknown, TMeta = unknown>(
  action: any
): action is AsyncResolvedAction<TPayload, TMeta> {
  return isAsyncAction(action) && action.async === AsyncStatus.RESOLVED;
}

/**
 * Checks if action is type of AsyncRejectedAction
 */
export function isAsyncRejectedAction<TMeta = unknown>(
  action: any
): action is AsyncRejectedAction<TMeta> {
  return isAsyncAction(action) && action.async === AsyncStatus.REJECTED;
}

/**
 * Checks if action is marked after previous timestamp. Returns undefined if it's impossible to detect.
 */
export function isAsyncActionAfter(
  action: AnyAsyncAction,
  prevTimestamp: number | undefined
): boolean | undefined {
  if (!prevTimestamp || !action.timestamp) {
    return undefined;
  }

  return action.timestamp > prevTimestamp;
}

/**
 * Options for async ThunkAction. You can set:
 *  * meta - in order to use the same default meta in all statuses
 *  * optimistic - optimistic payload to be passed to pending action
 *  * params - params for action like user id
 */
export interface AsyncThunkOptions<
  TOptimisticPayload,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
> {
  optimistic?: TOptimisticPayload;
  meta?: TMeta;
  params?: TParams;
}

/**
 * Creates thunk action that takes care of given Promise lifecycle.
 */
export function async<
  TPayload = undefined,
  TOptimisticPayload = TPayload,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
>(
  type: string,
  promise: Promise<TPayload>,
  options: AsyncThunkOptions<TOptimisticPayload, TMeta, TParams> = {},
  timestamp = Date.now()
): ThunkAction<Promise<TPayload>, AsyncMountedState, any, AnyAction> {
  const { pending, resolved, rejected } = createAsyncActionCreator<
    TPayload,
    TOptimisticPayload,
    TMeta,
    TParams
  >(type, options.params, options.meta, timestamp);

  return dispatch => {
    dispatch(pending(options.optimistic));

    return promise
      .then(data => {
        dispatch(resolved(data));
        return data;
      })
      .catch(error => {
        dispatch(rejected(error));
        throw error;
      });
  };
}
