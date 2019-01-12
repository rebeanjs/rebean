import memoize from 'fast-memoize';
import { createSelector, Selector } from 'reselect';
import { Snackbar } from './Snackbar';
import {DefaultSnackbarAwareState, defaultSnackbarKey, SnackbarState} from './SnackbarState';

export function createSnackbarSelectors<T extends object = any>(key: keyof T) {
  // tslint:disable:no-shadowed-variable
  const getSnackbarState: Selector<T, SnackbarState> = (state) =>
    (state && state[key]) as any || undefined;

  const getQueuedSnackbars = createSelector(
    getSnackbarState,
    (state) => (state && state.queued) || [],
  );

  const getOpenedSnackbarId = createSelector(
    getSnackbarState,
    (state) => (state && state.opened) || undefined,
  );

  const getClosedSnackbarIds = createSelector(
    getSnackbarState,
    (state) => (state && state.closed) || [],
  );

  const getOpenedSnackbar = createSelector(
    getQueuedSnackbars,
    getOpenedSnackbarId,
    (snackbars, openedId) => snackbars.filter(
      (snackbar) => snackbar.id === openedId,
    )[0],
  );

  const getAwaitingSnackbars = createSelector(
    getQueuedSnackbars,
    getOpenedSnackbarId,
    getClosedSnackbarIds,
    (snackbars, openedId, closedIds) =>
      snackbars.filter((snackbar) => {
        const isOpened = snackbar.id === openedId;
        const isClosed = closedIds.indexOf(snackbar.id) !== -1;

        return !isOpened && !isClosed;
      }),
  );

  const isSnackbarOpened = createSelector(
    getOpenedSnackbarId,
    (openedId) => openedId !== undefined,
  );

  const getNextSnackbar = createSelector(
    getAwaitingSnackbars,
    (snackbars) => snackbars[0],
  );

  const getSnackbar = memoize((id: Snackbar['id']) =>
    createSelector(
      getQueuedSnackbars,
      (snackbars) => snackbars.filter((snackbar) => snackbar.id === id)[0],
    ),
  );

  const isSnackbarUnique = memoize((message: string) =>
    createSelector(
      getOpenedSnackbar,
      (snackbar) => !snackbar || snackbar.message !== message,
    ),
  );
  // tslint:enable:no-shadowed-variable

  return {
    getSnackbarState,
    getQueuedSnackbars,
    getOpenedSnackbarId,
    getClosedSnackbarIds,
    getOpenedSnackbar,
    getAwaitingSnackbars,
    isSnackbarOpened,
    getNextSnackbar,
    getSnackbar,
    isSnackbarUnique,
  };
}

const {
  getSnackbarState,
  getQueuedSnackbars,
  getOpenedSnackbarId,
  getClosedSnackbarIds,
  getOpenedSnackbar,
  getAwaitingSnackbars,
  isSnackbarOpened,
  getNextSnackbar,
  getSnackbar,
  isSnackbarUnique,
} = createSnackbarSelectors<DefaultSnackbarAwareState>(defaultSnackbarKey);

export {
  getSnackbarState,
  getQueuedSnackbars,
  getOpenedSnackbarId,
  getClosedSnackbarIds,
  getOpenedSnackbar,
  getAwaitingSnackbars,
  isSnackbarOpened,
  getNextSnackbar,
  getSnackbar,
  isSnackbarUnique,
};
