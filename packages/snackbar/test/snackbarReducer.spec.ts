import {
  Snackbar,
  SNACKBAR_OPENED,
  SNACKBAR_QUEUED,
  snackbarOpened,
  snackbarQueued,
  snackbarReducer,
  SnackbarState,
} from '@rebean/snackbar';

describe('SnackbarReducer', () => {
  let initialState: SnackbarState;
  let snackbar: Snackbar;

  beforeEach(() => {
    initialState = {
      queued: [],
      opened: undefined,
      closed: [],
    };
    snackbar = {
      id: '1',
      message: 'Test',
      timeout: 1000,
    };
  });

  it('should add snackbar to the queued on SNACKBAR_QUEUED action from undefined state', () => {
    const prevState = undefined;
    const action = snackbarQueued(snackbar);
    const nextState = snackbarReducer(prevState, action);

    expect(nextState).toEqual({
      queued: [snackbar],
      opened: undefined,
      closed: [],
    });
  });

  it('should ignore SNACKBAR_QUEUED action if payload is empty', () => {
    const prevState = initialState;
    const nextState = snackbarReducer(prevState, { type: SNACKBAR_QUEUED });

    expect(nextState).toBe(prevState);
  });

  it('should set snackbar id as opened on SNACKBR_OPENED action', () => {
    const prevState = {
      queued: [snackbar],
      opened: undefined,
      closed: [],
    };
    const action = snackbarOpened(snackbar.id);
    const nextState = snackbarReducer(prevState, action);

    expect(nextState).toEqual({
      queued: [snackbar],
      opened: snackbar.id,
      closed: [],
    });
    expect(nextState.queued).toBe(prevState.queued);
    expect(nextState.closed).toBe(prevState.closed);
  });

  it('should set snackbar id as opened and update timeoutId on snackbar on SNACKBR_OPENED action', () => {
    const prevState = {
      queued: [snackbar],
      opened: undefined,
      closed: [],
    };
    const action = snackbarOpened(snackbar.id, 123);
    const nextState = snackbarReducer(prevState, action);

    expect(nextState).toEqual({
      queued: [
        {
          ...snackbar,
          timeoutId: 123,
        },
      ],
      opened: snackbar.id,
      closed: [],
    });
    expect(nextState.closed).toBe(prevState.closed);
  });

  it('should ignore SNACKBAR_OPENED if payload is empty', () => {
    const prevState = initialState;
    const nextState = snackbarReducer(prevState, { type: SNACKBAR_OPENED });

    expect(nextState).toBe(prevState);
  });
});
