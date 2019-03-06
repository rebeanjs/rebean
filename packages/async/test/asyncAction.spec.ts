import delay from 'delay';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  async,
  AsyncStatus,
  isAsyncAction,
  isAsyncActionAfter,
  isAsyncPendingAction,
  isAsyncRejectedAction,
  isAsyncResolvedAction
} from '../src';
import { AsyncMountedState } from '../src/AsyncState';

describe('asyncAction', () => {
  const mockStore = configureStore<any, any>([thunk]);

  it.each([
    [undefined, false, false, false, false],
    [null, false, false, false, false],
    [1, false, false, false, false],
    ['string', false, false, false, false],
    [{ type: 'FOO' }, false, false, false, false],
    [{ type: 'FOO', async: true }, false, false, false, false],
    [{ type: 'FOO', async: 'FOO' }, false, false, false, false],
    [{ async: AsyncStatus.PENDING }, false, false, false, false],
    [{ type: 'FOO', async: AsyncStatus.PENDING }, true, true, false, false],
    [{ type: 'FOO', async: AsyncStatus.RESOLVED }, true, false, true, false],
    [{ type: 'FOO', async: AsyncStatus.REJECTED }, true, false, false, true]
  ])(
    'should check if action is async for %p',
    (action, isAsync, isPending, isResolved, isRejected) => {
      expect(isAsyncAction(action)).toEqual(isAsync);
      expect(isAsyncPendingAction(action)).toEqual(isPending);
      expect(isAsyncResolvedAction(action)).toEqual(isResolved);
      expect(isAsyncRejectedAction(action)).toEqual(isRejected);
    }
  );

  it.each([
    [{ type: 'FOO' }, undefined, undefined],
    [{ type: 'FOO' }, 1, undefined],
    [{ type: 'FOO', timestamp: 1 }, undefined, undefined],
    [{ type: 'FOO', timestamp: 1 }, 1, false],
    [{ type: 'FOO', timestamp: 2 }, 1, true],
    [{ type: 'FOO', timestamp: 1 }, 2, false]
  ])(
    'should check if async action %p is after %p',
    (action, prevTimestamp, isAfter) => {
      expect(isAsyncActionAfter(action, prevTimestamp)).toEqual(isAfter);
    }
  );

  it('should create async thunk action for resolved promise', async () => {
    const state: AsyncMountedState | undefined = undefined;
    const store = mockStore(() => state);
    const onResolved = jest.fn();
    const onRejected = jest.fn();

    store
      .dispatch(async('X_SQUARE', Promise.resolve(4)))
      .then(onResolved)
      .catch(onRejected);

    expect(onResolved).not.toBeCalled();
    expect(onRejected).not.toBeCalled();

    expect(store.getActions()).toEqual([
      {
        type: 'X_SQUARE',
        async: AsyncStatus.PENDING,
        params: {},
        timestamp: expect.any(Number)
      }
    ]);
    const timestamp = store.getActions()[0].timestamp;
    store.clearActions();

    await delay(0);

    expect(store.getActions()).toEqual([
      {
        type: 'X_SQUARE',
        async: AsyncStatus.RESOLVED,
        params: {},
        timestamp,
        payload: 4
      }
    ]);

    expect(onResolved).toBeCalledWith(4);
    expect(onRejected).not.toBeCalled();
  });

  it('should create async thunk action for rejected promise', async () => {
    const state: AsyncMountedState | undefined = undefined;
    const store = mockStore(() => state);
    const onResolved = jest.fn();
    const onRejected = jest.fn();

    store
      .dispatch(async('X_SQUARE', Promise.reject('INTERNAL_ERROR')))
      .then(onResolved)
      .catch(onRejected);

    expect(onResolved).not.toBeCalled();
    expect(onRejected).not.toBeCalled();

    expect(store.getActions()).toEqual([
      {
        type: 'X_SQUARE',
        async: AsyncStatus.PENDING,
        params: {},
        timestamp: expect.any(Number)
      }
    ]);
    const timestamp = store.getActions()[0].timestamp;
    store.clearActions();

    await delay(0);

    expect(store.getActions()).toEqual([
      {
        type: 'X_SQUARE',
        async: AsyncStatus.REJECTED,
        params: {},
        timestamp,
        payload: 'INTERNAL_ERROR',
        error: true
      }
    ]);

    expect(onResolved).not.toBeCalled();
    expect(onRejected).toBeCalledWith('INTERNAL_ERROR');
  });

  it('should create async thunk action for resolved promise with options', async () => {
    const state: AsyncMountedState | undefined = undefined;
    const store = mockStore(() => state);
    const onResolved = jest.fn();
    const onRejected = jest.fn();
    const timestamp = 1000;

    store
      .dispatch(
        async(
          'X_SQUARE',
          Promise.resolve(4),
          {
            optimistic: 4,
            meta: { useGPU: true },
            params: { x: 2 }
          },
          timestamp
        )
      )
      .then(onResolved)
      .catch(onRejected);

    expect(onResolved).not.toBeCalled();
    expect(onRejected).not.toBeCalled();

    expect(store.getActions()).toEqual([
      {
        type: 'X_SQUARE',
        async: AsyncStatus.PENDING,
        payload: 4,
        meta: { useGPU: true },
        params: { x: 2 },
        timestamp
      }
    ]);
    store.clearActions();

    await delay(0);

    expect(store.getActions()).toEqual([
      {
        type: 'X_SQUARE',
        async: AsyncStatus.RESOLVED,
        payload: 4,
        meta: { useGPU: true },
        params: { x: 2 },
        timestamp
      }
    ]);

    expect(onResolved).toBeCalledWith(4);
    expect(onRejected).not.toBeCalled();
  });
});
