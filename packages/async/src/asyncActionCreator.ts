import {
  AsyncPendingAction,
  AsyncRejectedAction,
  AsyncResolvedAction
} from './asyncAction';
import { AsyncActionParams } from './AsyncActionParams';
import { AsyncStatus } from './AsyncStatus';

/**
 * Creates async pending action
 *
 * @param type Action type
 * @param params Action params (for example { id: 2 })
 * @param optimisticPayload Optimistic payload for pending action
 * @param meta Additional information
 * @param timestamp Timestamp of action creation to keep track of actions order
 */
export function createAsyncPendingAction<
  TPayload = undefined,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
>(
  type: string,
  params?: TParams,
  optimisticPayload?: TPayload,
  meta?: TMeta,
  timestamp = Date.now()
): AsyncPendingAction<TPayload, TMeta, TParams> {
  const action: AsyncPendingAction<TPayload, TMeta, TParams> = {
    type,
    async: AsyncStatus.PENDING,
    params: params || {}
  } as any; // we use default undefined generic instead of optional operator

  if (optimisticPayload !== undefined) {
    action.payload = optimisticPayload;
  }
  if (meta !== undefined) {
    action.meta = meta;
  }
  if (timestamp !== undefined) {
    action.timestamp = timestamp;
  }

  return action;
}

/**
 * Creates async resolved action
 *
 * @param type Action type
 * @param params Action params (for example { id: 2 })
 * @param payload Payload for resolved action
 * @param meta Additional information
 * @param timestamp Timestamp of action creation to keep track of actions order
 */
export function createAsyncResolvedAction<
  TPayload = undefined,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
>(
  type: string,
  params?: TParams,
  payload?: TPayload,
  meta?: TMeta,
  timestamp = Date.now()
): AsyncResolvedAction<TPayload, TMeta, TParams> {
  const action: AsyncResolvedAction<TPayload, TMeta, TParams> = {
    type,
    async: AsyncStatus.RESOLVED,
    params: params || {}
  } as any; // we use default undefined generic instead of optional operator

  if (payload !== undefined) {
    action.payload = payload;
  }
  if (meta !== undefined) {
    action.meta = meta;
  }
  if (timestamp !== undefined) {
    action.timestamp = timestamp;
  }

  return action;
}

/**
 * Creates async rejected action
 *
 * @param type Action type
 * @param params Action params (for example { id: 2 })
 * @param error Error for rejected action (will be passed to payload field to follow FSA specification)
 * @param meta Additional information
 * @param timestamp Timestamp of action creation to keep track of actions order
 */
export function createAsyncRejectedAction<
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
>(
  type: string,
  params?: TParams,
  error?: any,
  meta?: TMeta,
  timestamp = Date.now()
): AsyncRejectedAction<TMeta, TParams> {
  const action: AsyncRejectedAction<TMeta, TParams> = {
    type,
    async: AsyncStatus.REJECTED,
    error: true,
    params: params || {}
  } as any; // we use default undefined generic instead of optional operator

  if (error !== undefined) {
    action.payload = error;
  }
  if (meta !== undefined) {
    action.meta = meta;
  }
  if (timestamp !== undefined) {
    action.timestamp = timestamp;
  }

  return action;
}

/**
 * Interface that defines async action creator.
 * It helps to manage async actions creation - actions created by this creator will have the same type and params.
 */
export interface AsyncActionCreator<
  TPayload = undefined,
  TOptimisticPayload = TPayload,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
> {
  pending: (
    payload?: TOptimisticPayload,
    meta?: TMeta,
    timestamp?: number
  ) => AsyncPendingAction<TOptimisticPayload, TMeta, TParams>;
  resolved: (
    payload?: TPayload,
    meta?: TMeta,
    timestamp?: number
  ) => AsyncResolvedAction<TPayload, TMeta, TParams>;
  rejected: (
    payload?: any,
    meta?: TMeta,
    timestamp?: number
  ) => AsyncRejectedAction<TMeta, TParams>;
}

/**
 * Creates async action creator to manage async actions creation
 * (keeps same type and params for pending, resolved and rejected action).
 *
 * @param type Action type
 * @param params Action params (for example { id: 2 })
 * @param meta Meta that will be shared by default between actions
 * @param timestamp Timestamp of action creation that will be shared by default between actions
 */
export function createAsyncActionCreator<
  TPayload = unknown,
  TOptimisticPayload = TPayload,
  TMeta = undefined,
  TParams extends AsyncActionParams = AsyncActionParams
>(
  type: string,
  params?: TParams,
  meta?: TMeta,
  timestamp = Date.now()
): AsyncActionCreator<TPayload, TOptimisticPayload, TMeta, TParams> {
  function pending(
    payload?: TOptimisticPayload,
    specificMeta = meta,
    specificTimestamp = timestamp
  ) {
    return createAsyncPendingAction(
      type,
      params,
      payload,
      specificMeta,
      specificTimestamp
    );
  }
  function resolved(
    payload?: TPayload,
    specificMeta = meta,
    specificTimestamp = timestamp
  ) {
    return createAsyncResolvedAction(
      type,
      params,
      payload,
      specificMeta,
      specificTimestamp
    );
  }
  function rejected(
    payload?: any,
    specificMeta = meta,
    specificTimestamp = timestamp
  ) {
    return createAsyncRejectedAction(
      type,
      params,
      payload,
      specificMeta,
      specificTimestamp
    );
  }

  return { pending, resolved, rejected };
}
