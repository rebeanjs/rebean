import { Snackbar } from './Snackbar';

/**
 * State that describes which snackbars are queued, open or closed
 */
export type SnackbarState = {
  queued: Snackbar[];
  opened: Snackbar['id'] | undefined;
  closed: Array<Snackbar['id']>;
};

/**
 * Default key on which SnackbarState is mounted
 */
export const defaultSnackbarKey = 'snackbar';

/**
 * Default state that has mounted SnackbarState on snackbar key
 */
export type DefaultSnackbarAwareState = {
  snackbar?: SnackbarState;
  [key: string]: any;
};
