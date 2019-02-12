import {
  SNACKBAR_CLOSED,
  SNACKBAR_OPENED,
  SNACKBAR_QUEUED,
  SNACKBAR_REMOVED,
  SnackbarActions,
} from './snackbarAction';
import { SnackbarState } from './SnackbarState';

export const snackbarInitialState: SnackbarState = {
  queued: [],
  opened: undefined,
  closed: [],
};

export function snackbarReducer(
  state = snackbarInitialState,
  action: SnackbarActions,
): SnackbarState {
  switch (action.type) {
    case SNACKBAR_QUEUED:
      if (action.payload) {
        return {
          ...state,
          queued: [...(state.queued || []), action.payload],
        };
      } else {
        return state;
      }

    case SNACKBAR_OPENED:
      if (action.payload) {
        return {
          ...state,
          queued: action.payload!.timeoutId
            ? (state.queued || []).map(snackbar =>
                snackbar.id === action.payload!.id
                  ? { ...snackbar, timeoutId: action.payload!.timeoutId }
                  : snackbar,
              )
            : state.queued || [],
          opened: action.payload.id,
        };
      } else {
        return state;
      }

    case SNACKBAR_CLOSED:
      if (action.payload) {
        return {
          ...state,
          opened: state.opened === action.payload ? undefined : state.opened,
          closed: [...(state.closed || []), action.payload],
        };
      } else {
        return state;
      }

    case SNACKBAR_REMOVED:
      return {
        ...state,
        opened: state.opened === action.payload ? undefined : state.opened,
        closed: (state.closed || []).filter(id => id !== action.payload),
        queued: (state.queued || []).filter(
          snackbar => snackbar.id !== action.payload,
        ),
      };

    default:
      return state;
  }
}
