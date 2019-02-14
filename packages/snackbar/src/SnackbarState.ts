import { Snackbar } from './Snackbar';

/**
 * State that describes which snackbars are queued, open or closed
 */
export type SnackbarState = {
  queued: Snackbar[];
  opened: Snackbar['id'] | undefined;
  closed: Snackbar['id'][];
};

/**
 * Default state that has mounted SnackbarState on snackbar key
 */
export type SnackbarMountedState = {
  snackbar?: SnackbarState;
  [key: string]: any;
};
