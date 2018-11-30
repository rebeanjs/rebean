import { Snackbar } from './Snackbar';

export type SnackbarState = {
  snackbar: {
    registered: Snackbar[];
    opened: Snackbar['id'] | undefined;
    closed: Snackbar['id'][];
  };
};

export type SnackbarAwareState = Partial<SnackbarState> & {
  [key: string]: any;
};
