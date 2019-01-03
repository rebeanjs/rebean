/**
 * Snackbar model
 */
export type Snackbar = {
  /**
   * UUID v4 to identify snackbar.
   */
  id: string;

  /**
   * Message to display inside the snackbar.
   */
  message: string;

  /**
   * Number of milliseconds for snackbar to be visible.
   */
  timeout?: number;

  /**
   * Internal timeout id to manage snackbars scheduling.
   */
  timeoutId?: any;
};
