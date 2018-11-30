import { createSelector, Selector } from 'reselect';
import { SnackbarState } from './SnackbarState';
import { Snackbar } from './Snackbar';
import memoize from 'fast-memoize';

type SnackbarStateAware = Partial<SnackbarState> & { [key: string]: any };

export const getRegisteredSnackbars: Selector<SnackbarStateAware, Snackbar[]> = state =>
  (state && state.snackbar && state.snackbar.registered) || [];

const getOpenedSnackbarId: Selector<
  SnackbarStateAware,
  Snackbar['id'] | undefined
> = state => (state && state.snackbar && state.snackbar.opened) || undefined;

const getClosedSnackbarIds: Selector<SnackbarStateAware, Snackbar['id'][]> = state =>
  (state && state.snackbar && state.snackbar.closed) || [];

export const getOpenedSnackbar = createSelector(
  getRegisteredSnackbars,
  getOpenedSnackbarId,
  (snackbars, openedId) => snackbars.filter(snackbar => snackbar.id === openedId)[0]
);

export const getQueuedSnackbars = createSelector(
  getRegisteredSnackbars,
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
  getQueuedSnackbars,
  snackbars => (snackbars.length ? snackbars[0] : undefined)
);

export const getSnackbar = memoize((id: Snackbar['id']) =>
  createSelector(getRegisteredSnackbars, snackbars =>
    snackbars.filter(snackbar => snackbar.id === id)[0]
  )
) as (id: Snackbar['id']) => Selector<SnackbarStateAware, Snackbar | undefined>;

export const isSnackbarUnique = memoize((message: string) =>
  createSelector(getOpenedSnackbar, snackbar => !snackbar || snackbar.message !== message)
) as (message: string) => Selector<SnackbarStateAware, boolean>;
