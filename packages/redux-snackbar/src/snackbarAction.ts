import { ThunkAction } from 'redux-thunk';
import {
  getNextSnackbar,
  getSnackbar,
  isSnackbarOpened,
  isSnackbarUnique
} from './snackbarSelector';
import { SnackbarAwareState } from './SnackbarState';
import { Snackbar } from './Snackbar';
import { uuid } from './uuid';

export const SNACKBAR_REGISTERED = '@@redux-snackbar/SNACKBAR_REGISTERED';
export type SnackbarRegisteredAction = {
  type: typeof SNACKBAR_REGISTERED;
  payload?: Snackbar;
};
export const snackbarRegistered = (snackbar: Snackbar): SnackbarRegisteredAction => ({
  type: SNACKBAR_REGISTERED,
  payload: snackbar
});

export const SNACKBAR_OPENED = '@@redux-snackbar/SNACKBAR_OPENED';
export type SnackbarOpenedAction = {
  type: typeof SNACKBAR_OPENED;
  payload?: { id: Snackbar['id']; timeoutId?: number };
};
export const snackbarOpened = (id: Snackbar['id'], timeoutId?: number): SnackbarOpenedAction => ({
  type: SNACKBAR_OPENED,
  payload: { id, timeoutId }
});

export const SNACKBAR_CLOSED = '@@redux-snackbar/SNACKBAR_CLOSED';
export type SnackbarClosedAction = {
  type: typeof SNACKBAR_CLOSED;
  payload?: Snackbar['id'];
};
export const snackbarClosed = (id: Snackbar['id']): SnackbarClosedAction => ({
  type: SNACKBAR_CLOSED,
  payload: id
});

export const SNACKBAR_UNREGISTERED = '@@redux-snackbar/SNACKBAR_UNREGISTERED';
export type SnackbarUnregisteredAction = {
  type: typeof SNACKBAR_UNREGISTERED;
  payload?: Snackbar['id'];
};
export const snackbarUnregistered = (id: Snackbar['id']): SnackbarUnregisteredAction => ({
  type: SNACKBAR_UNREGISTERED,
  payload: id
});

export type Actions =
  | SnackbarRegisteredAction
  | SnackbarOpenedAction
  | SnackbarClosedAction
  | SnackbarUnregisteredAction;

export const openSnackbar = (
  message: string,
  timeout = 5000,
  unique = true
): ThunkAction<Snackbar['id'] | undefined, SnackbarAwareState, any, Actions> => (
  dispatch,
  getState
) => {
  if (unique && !isSnackbarUnique(message)(getState())) {
    // don't display snackbar if the current one is same
    return undefined;
  }

  const id = uuid();

  dispatch(snackbarRegistered({ id, message, timeout }));

  // schedule snackbar opened and closed action
  // to animate snackbar enter we have to open in next tick
  window.setTimeout(() => {
    if (!isSnackbarOpened(getState())) {
      dispatch(scheduleSnackbar(id));
    }
  }, 0);

  return id;
};

export const closeSnackbar = (
  id: Snackbar['id']
): ThunkAction<void, SnackbarAwareState, any, Actions> => (dispatch, getState) => {
  const snackbar = getSnackbar(id)(getState());

  if (snackbar) {
    if (snackbar.timeoutId) {
      window.clearTimeout(snackbar.timeoutId);
    }

    dispatch(snackbarClosed(id));

    // schedule next snackbar
    const nextSnackbar = getNextSnackbar(getState());
    if (nextSnackbar) {
      dispatch(scheduleSnackbar(nextSnackbar.id));
    }

    // to animate snackbar leave
    window.setTimeout(() => dispatch(snackbarUnregistered(id)), 1000);
  }
};

const scheduleSnackbar = (
  id: Snackbar['id']
): ThunkAction<number | undefined, SnackbarAwareState, any, Actions> => (dispatch, getState) => {
  const snackbar = getSnackbar(id)(getState());
  let timeoutId: number | undefined;

  if (snackbar) {
    if (snackbar.timeout) {
      timeoutId = window.setTimeout(
        () => dispatch(closeSnackbar(id)),
        snackbar.timeout
      );
    }

    dispatch(snackbarOpened(id, timeoutId));
  }

  return timeoutId;
};
