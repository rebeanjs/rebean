import memoize from 'fast-memoize';
import { createSelector, Selector } from 'reselect';
import { Snackbar } from './Snackbar';
import { SnackbarMountedState, SnackbarState } from './SnackbarState';

const getSnackbarState: Selector<
  SnackbarMountedState,
  SnackbarState | undefined
> = state => (state && state.snackbar) || undefined;

export const getQueuedSnackbars = createSelector(
  getSnackbarState,
  state => (state && state.queued) || []
);

export const getOpenedSnackbarId = createSelector(
  getSnackbarState,
  state => (state && state.opened) || undefined
);

export const getClosedSnackbarIds = createSelector(
  getSnackbarState,
  state => (state && state.closed) || []
);

export const getOpenedSnackbar = createSelector(
  getQueuedSnackbars,
  getOpenedSnackbarId,
  (snackbars, openedId) =>
    snackbars.filter(snackbar => snackbar.id === openedId)[0]
);

export const getAwaitingSnackbars = createSelector(
  getQueuedSnackbars,
  getOpenedSnackbarId,
  getClosedSnackbarIds,
  (snackbars, openedId, closedIds) =>
    snackbars.filter(snackbar => {
      const isOpened = snackbar.id === openedId;
      const isClosed = closedIds.indexOf(snackbar.id) !== -1;

      return !isOpened && !isClosed;
    })
);

export const isSnackbarOpened = createSelector(
  getOpenedSnackbarId,
  openedId => openedId !== undefined
);

export const getNextSnackbar = createSelector(
  getAwaitingSnackbars,
  snackbars => snackbars[0]
);

export const getSnackbar = memoize((id: Snackbar['id']) =>
  createSelector(
    getQueuedSnackbars,
    snackbars => snackbars.filter(snackbar => snackbar.id === id)[0]
  )
);

export const isSnackbarUnique = memoize((message: string) =>
  createSelector(
    getOpenedSnackbar,
    snackbar => !snackbar || snackbar.message !== message
  )
);
