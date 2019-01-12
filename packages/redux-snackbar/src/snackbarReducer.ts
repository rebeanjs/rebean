import { Reducer} from 'redux';
import {
  SNACKBAR_CLOSED,
  SNACKBAR_OPENED,
  SNACKBAR_QUEUED,
  SNACKBAR_REMOVED,
  SnackbarActions,
} from './snackbarAction';
import {DefaultSnackbarAwareState, defaultSnackbarKey, SnackbarState} from './SnackbarState';

const initialState: SnackbarState = {
  queued: [],
  opened: undefined,
  closed: [],
};

function snackbarStateReducer(state = initialState, action: SnackbarActions): SnackbarState {
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
            ? (state.queued || []).map(
              (snackbar) =>
                snackbar.id === action.payload!.id
                  ? { ...snackbar, timeoutId: action.payload!.timeoutId }
                  : snackbar,
            )
            : (state.queued || []),
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
        closed: (state.closed || []).filter((id) => id !== action.payload),
        queued: (state.queued || []).filter((snackbar) => snackbar.id !== action.payload),
      };

    default:
      return state;
  }
}

export function createSnackbarReducer<T extends object = any>(key: keyof T, initialState?: T): Reducer<T> {
  return (state: T | undefined = initialState, action: SnackbarActions) => {
    const prevSnackbarState: SnackbarState = (state || {} as T)[key] as any;
    const nextSnackbarState = snackbarStateReducer(prevSnackbarState, action);

    if (prevSnackbarState === nextSnackbarState) {
      return state;
  } else {
      return {
        ...(state || {} as any),
        [key]: nextSnackbarState,
      };
    }
  };
}

export const snackbarReducer = createSnackbarReducer<DefaultSnackbarAwareState>(defaultSnackbarKey);
