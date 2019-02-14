import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  closeSnackbar,
  openSnackbar,
  SNACKBAR_CLOSED,
  SNACKBAR_OPENED,
  SNACKBAR_QUEUED,
  SNACKBAR_REMOVED,
  snackbarClosed,
  SnackbarMountedState,
  snackbarOpened,
  snackbarQueued,
  snackbarRemoved
} from '../src';

jest.useFakeTimers();

describe('SnackbarAction', () => {
  const mockStore = configureStore<any, any>([thunk]);

  it('should create SNACKBAR_QUEUED action', () => {
    expect(snackbarQueued).toBeDefined();
    expect(
      snackbarQueued({
        id: 'some_unique_id',
        message: 'Hello world'
      })
    ).toEqual({
      type: '@@redux-snackbar/SNACKBAR_QUEUED',
      payload: {
        id: 'some_unique_id',
        message: 'Hello world'
      }
    });
    expect(
      snackbarQueued({
        id: 'some_unique_id',
        message: 'Hello world',
        timeout: 5000,
        timeoutId: 6432
      })
    ).toEqual({
      type: '@@redux-snackbar/SNACKBAR_QUEUED',
      payload: {
        id: 'some_unique_id',
        message: 'Hello world',
        timeout: 5000,
        timeoutId: 6432
      }
    });
  });

  it('should create SNACKBAR_OPENED action', () => {
    expect(snackbarOpened).toBeDefined();
    expect(snackbarOpened('some_unique_id')).toEqual({
      type: '@@redux-snackbar/SNACKBAR_OPENED',
      payload: {
        id: 'some_unique_id'
      }
    });
    expect(snackbarOpened('another_unique_id', 6432)).toEqual({
      type: '@@redux-snackbar/SNACKBAR_OPENED',
      payload: {
        id: 'another_unique_id',
        timeoutId: 6432
      }
    });
  });

  it('should create SNACKBAR_CLOSED action', () => {
    expect(snackbarClosed).toBeDefined();
    expect(snackbarClosed('another_unique_id')).toEqual({
      type: '@@redux-snackbar/SNACKBAR_CLOSED',
      payload: 'another_unique_id'
    });
  });

  it('should create SNACKBAR_REMOVED action', () => {
    expect(snackbarRemoved).toBeDefined();
    expect(snackbarRemoved('some_unique_id')).toEqual({
      type: '@@redux-snackbar/SNACKBAR_REMOVED',
      payload: 'some_unique_id'
    });
  });

  it('should queue and schedule snackbar on openSnackbar action', () => {
    expect(openSnackbar).toBeDefined();

    let state: SnackbarMountedState | undefined;
    const store = mockStore(() => state);

    const id = store.dispatch(openSnackbar('Test message', 5000));
    const snackbar = {
      id,
      message: 'Test message',
      timeout: 5000
    };
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_QUEUED,
        payload: snackbar
      }
    ]);

    store.clearActions();
    state = {
      snackbar: {
        queued: [snackbar],
        opened: undefined,
        closed: []
      }
    };
    jest.runOnlyPendingTimers();
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_OPENED,
        payload: {
          id: snackbar.id,
          timeoutId: expect.anything()
        }
      }
    ]);

    store.clearActions();
    state = {
      snackbar: {
        queued: [snackbar],
        opened: snackbar.id,
        closed: []
      }
    };
    jest.advanceTimersByTime(3000);
    expect(store.getActions()).toEqual([]);

    jest.advanceTimersByTime(2000);
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_CLOSED,
        payload: snackbar.id
      }
    ]);

    store.clearActions();
    state = {
      snackbar: {
        queued: [snackbar],
        opened: undefined,
        closed: [snackbar.id]
      }
    };
    jest.advanceTimersByTime(500);
    expect(store.getActions()).toEqual([]);

    jest.advanceTimersByTime(500);
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_REMOVED,
        payload: snackbar.id
      }
    ]);
  });

  it('should not queue and schedule snackbar on openSnackbar action if snackbar is not unique', () => {
    let state: SnackbarMountedState | undefined;
    const store = mockStore(() => state);

    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          },
          {
            id: '2',
            message: 'Another message',
            timeout: 2000
          }
        ],
        opened: '1',
        closed: []
      }
    };

    const firstId = store.dispatch(openSnackbar('Some message'));
    expect(firstId).toEqual(undefined);
    expect(store.getActions()).toEqual([]);

    const secondId = store.dispatch(openSnackbar('Another message'));
    expect(secondId).toBeDefined();
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_QUEUED,
        payload: {
          id: secondId,
          message: 'Another message',
          timeout: 5000
        }
      }
    ]);
  });

  it('should queue and schedule snackbar on openSnackbar action even if snackbar is not unique', () => {
    let state: SnackbarMountedState | undefined;
    const store = mockStore(() => state);

    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          },
          {
            id: '2',
            message: 'Another message',
            timeout: 2000
          }
        ],
        opened: '1',
        closed: []
      }
    };

    const firstId = store.dispatch(openSnackbar('Some message', 5000, false));
    expect(firstId).toBeDefined();
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_QUEUED,
        payload: {
          id: firstId,
          message: 'Some message',
          timeout: 5000
        }
      }
    ]);
  });

  it('should not schedule snackbar immediately on openSnackbar action if some snackbar is opened', () => {
    let state: SnackbarMountedState | undefined;
    const store = mockStore(() => state);

    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          }
        ],
        opened: '1',
        closed: []
      }
    };

    const firstId = store.dispatch(openSnackbar('Another message'));
    expect(firstId).toBeDefined();
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_QUEUED,
        payload: {
          id: firstId,
          message: 'Another message',
          timeout: 5000
        }
      }
    ]);

    store.clearActions();
    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          },
          {
            id: firstId,
            message: 'Another message',
            timeout: 5000
          }
        ],
        opened: '1',
        closed: []
      }
    };
    jest.runOnlyPendingTimers();
    expect(store.getActions()).toEqual([]);
  });

  it('should close snackbar and schedule snackbar remove on closeSnackbar action', () => {
    let state: SnackbarMountedState | undefined;
    const timeoutSpy = jest.fn();
    const store = mockStore(() => state);
    const timeoutId = setTimeout(timeoutSpy, 500);

    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000,
            timeoutId
          }
        ],
        opened: '1',
        closed: []
      }
    };
    store.dispatch(closeSnackbar('1'));
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_CLOSED,
        payload: '1'
      }
    ]);

    store.clearActions();
    jest.advanceTimersByTime(1000);
    expect(timeoutSpy).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_REMOVED,
        payload: '1'
      }
    ]);
  });

  it('should schedule next snackbar on closeSnackbar action', () => {
    let state: SnackbarMountedState | undefined;
    const store = mockStore(() => state);

    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          },
          {
            id: '2',
            message: 'Another message'
          }
        ],
        opened: '1',
        closed: []
      }
    };
    store.dispatch(closeSnackbar('1'));
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_CLOSED,
        payload: '1'
      },
      {
        type: SNACKBAR_OPENED,
        payload: {
          id: '2',
          timeoutId: undefined
        }
      }
    ]);

    store.clearActions();
    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          },
          {
            id: '2',
            message: 'Another message',
            timeout: 5000
          }
        ],
        opened: '2',
        closed: ['1']
      }
    };
    jest.advanceTimersByTime(1000);
    expect(store.getActions()).toEqual([
      {
        type: SNACKBAR_REMOVED,
        payload: '1'
      }
    ]);

    store.clearActions();
    jest.runAllTimers();
    expect(store.getActions()).toEqual([]);
  });

  it('should do nothing on closeSnackbar action if snackbar does not exists', () => {
    let state: SnackbarMountedState | undefined;
    const store = mockStore(() => state);

    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          }
        ],
        opened: '1',
        closed: []
      }
    };
    store.dispatch(closeSnackbar('2'));
    expect(store.getActions()).toEqual([]);

    state = {
      snackbar: {
        queued: [
          {
            id: '1',
            message: 'Some message',
            timeout: 3000
          }
        ],
        opened: undefined,
        closed: []
      }
    };
    store.dispatch(closeSnackbar('2'));
    expect(store.getActions()).toEqual([]);
  });
});
