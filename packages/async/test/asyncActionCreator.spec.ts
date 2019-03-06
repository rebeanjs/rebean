import {
  AsyncStatus,
  createAsyncActionCreator,
  createAsyncPendingAction,
  createAsyncRejectedAction,
  createAsyncResolvedAction
} from '../src';

describe('asyncActionCreator', () => {
  it('should create async pending action with proper shape using createAsyncPendingAction', () => {
    expect(createAsyncPendingAction('X_SQUARE')).toEqual({
      type: 'X_SQUARE',
      async: AsyncStatus.PENDING,
      params: {},
      timestamp: expect.any(Number)
    });
    expect(
      createAsyncPendingAction('X_SQUARE', { x: 2 }, 4, { useGPU: true }, 1000)
    ).toMatchSnapshot();
  });

  it('should create async resolved action with proper shape using createAsyncResolvedAction', () => {
    expect(createAsyncResolvedAction('X_SQUARE')).toEqual({
      type: 'X_SQUARE',
      async: AsyncStatus.RESOLVED,
      params: {},
      timestamp: expect.any(Number)
    });
    expect(
      createAsyncResolvedAction('X_SQUARE', { x: 2 }, 4, { useGPU: true }, 1000)
    ).toMatchSnapshot();
  });

  it('should create async rejected action with proper shape using createAsyncResolvedAction', () => {
    expect(createAsyncRejectedAction('X_SQUARE')).toEqual({
      type: 'X_SQUARE',
      async: AsyncStatus.REJECTED,
      params: {},
      timestamp: expect.any(Number),
      error: true
    });
    expect(
      createAsyncRejectedAction(
        'X_SQUARE',
        { x: -2 },
        'NEGATIVE_NUMBERS_NOT_SUPPORTED',
        { useGPU: true },
        1000
      )
    ).toMatchSnapshot();
  });

  it('should create async action creator', () => {
    expect(createAsyncActionCreator('X_SQUARE')).toEqual({
      pending: expect.any(Function),
      resolved: expect.any(Function),
      rejected: expect.any(Function)
    });
  });

  it('should create same actions for both variants', () => {
    const { pending, resolved, rejected } = createAsyncActionCreator(
      'X_SQUARE',
      { x: 2 },
      { useGPU: true },
      1000
    );

    expect(pending(4)).toEqual(
      createAsyncPendingAction('X_SQUARE', { x: 2 }, 4, { useGPU: true }, 1000)
    );
    expect(resolved(4)).toEqual(
      createAsyncResolvedAction('X_SQUARE', { x: 2 }, 4, { useGPU: true }, 1000)
    );
    expect(rejected('INTERNAL_ERROR')).toEqual(
      createAsyncRejectedAction(
        'X_SQUARE',
        { x: 2 },
        'INTERNAL_ERROR',
        { useGPU: true },
        1000
      )
    );
  });

  it('should create same actions for both variants with specific meta and timestamp', () => {
    const { pending, resolved, rejected } = createAsyncActionCreator(
      'X_SQUARE',
      { x: 2 },
      { useGPU: true },
      1000
    );

    expect(pending(4, { useGPU: false }, 4000)).toEqual(
      createAsyncPendingAction('X_SQUARE', { x: 2 }, 4, { useGPU: false }, 4000)
    );
    expect(resolved(4, { useGPU: false }, 4000)).toEqual(
      createAsyncResolvedAction(
        'X_SQUARE',
        { x: 2 },
        4,
        { useGPU: false },
        4000
      )
    );
    expect(rejected('INTERNAL_ERROR', { useGPU: false }, 4000)).toEqual(
      createAsyncRejectedAction(
        'X_SQUARE',
        { x: 2 },
        'INTERNAL_ERROR',
        { useGPU: false },
        4000
      )
    );
  });
});
