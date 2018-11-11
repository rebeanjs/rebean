export type Snackbar = Readonly<{
  id: string;
  message: string;
  timeout?: number;
  timeoutId?: number;
}>;
