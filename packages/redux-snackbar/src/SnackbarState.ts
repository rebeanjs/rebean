import { Snackbar } from './Snackbar';

export namespace SnackbarState {
  export type Domain = {
    registered: Snackbar[];
    opened: Snackbar['id'] | undefined;
    closed: Snackbar['id'][];
  };
}

export type SnackbarState = {
  snackbar?: SnackbarState.Domain;
};

export type SnackbarAwareState = SnackbarState & {
  [key: string]: any;
};
