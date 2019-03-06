import memoize from 'fast-memoize';
import { getAsyncActionKey } from './asyncActionKey';
import { AsyncActionParams } from './AsyncActionParams';
import { AsyncMountedState, AsyncState } from './AsyncState';
import { AsyncStatus } from './AsyncStatus';

function getAsyncDomain(state: AsyncMountedState): AsyncState {
  return (state && state.async) || { status: {}, timestamp: {} };
}

const getAsyncStatusesOfType = memoize(
  (type: string) => (state: AsyncMountedState) => {
    const { status } = getAsyncDomain(state);

    return Object.keys(status || {})
      .filter(
        actionKey => actionKey === type || actionKey.indexOf(type + ' ') === 0
      )
      .map(actionKey => status[actionKey]);
  }
);

const getAsyncStatusOfType = memoize(
  (type: string) => (state: AsyncMountedState) =>
    AsyncStatus.all(...getAsyncStatusesOfType(type)(state))
);

const getAsyncStatusOfTypeAndParams = memoize(
  (type: string, params?: Partial<AsyncActionParams>) => (
    state: AsyncMountedState
  ) => {
    const { status } = getAsyncDomain(state);

    return (status && status[getAsyncActionKey(type, params)]) || undefined;
  }
);

export const getAsyncStatus = memoize(
  (type: string, params?: Partial<AsyncActionParams>, exact = true) => (
    state: AsyncMountedState
  ) => {
    return exact
      ? getAsyncStatusOfTypeAndParams(type, params)(state)
      : getAsyncStatusOfType(type)(state);
  }
);

export const hasAsyncStatus = memoize(
  (
    type: string,
    params?: Partial<AsyncActionParams>,
    status?: AsyncStatus,
    exact = true
  ) => (state: AsyncMountedState) =>
    getAsyncStatus(type, params, exact)(state) === status
);

export const isAsyncPending = memoize(
  (type: string, params?: Partial<AsyncActionParams>, exact = true) => (
    state: AsyncMountedState
  ) => hasAsyncStatus(type, params, AsyncStatus.PENDING, exact)(state)
);

export const isAsyncResolved = memoize(
  (type: string, params?: Partial<AsyncActionParams>, exact = true) => (
    state: AsyncMountedState
  ) => hasAsyncStatus(type, params, AsyncStatus.RESOLVED, exact)(state)
);

export const isAsyncRejected = memoize(
  (type: string, params?: Partial<AsyncActionParams>, exact = true) => (
    state: AsyncMountedState
  ) => hasAsyncStatus(type, params, AsyncStatus.REJECTED, exact)(state)
);

export const getAsyncTimestamp = memoize(
  (type: string, params?: Partial<AsyncActionParams>) => (
    state: AsyncMountedState
  ) => {
    const { timestamp } = getAsyncDomain(state);

    return (
      (timestamp && timestamp[getAsyncActionKey(type, params)]) || undefined
    );
  }
);
