import {
  Actions,
  SNACKBAR_CLOSED,
  SNACKBAR_OPENED,
  SNACKBAR_REGISTERED,
  SNACKBAR_UNREGISTERED
} from './snackbarAction';
import { SnackbarAwareState, SnackbarState } from './SnackbarState';
import { Reducer } from 'redux';

const initialDomain: SnackbarState.Domain = {
  registered: [],
  opened: undefined,
  closed: []
};

const initialState: SnackbarState = {
  snackbar: initialDomain
};

const snackbarDomainReducer: Reducer<SnackbarState.Domain> = (
  state = initialDomain,
  action: Actions
) => {
  switch (action.type) {
    case SNACKBAR_REGISTERED:
      if (action.payload) {
        return {
          ...state,
          registered: [...(state.registered || []), action.payload]
        };
      } else {
        return state;
      }

    case SNACKBAR_OPENED:
      if (action.payload) {
        return {
          ...state,
          registered: (state.registered || []).map(
            snackbar =>
              snackbar.id === action.payload!.id
                ? { ...snackbar, timeoutId: action.payload!.timeoutId }
                : snackbar
          ),
          opened: action.payload.id
        };
      } else {
        return state;
      }

    case SNACKBAR_CLOSED:
      if (action.payload) {
        return {
          ...state,
          opened: state.opened === action.payload ? undefined : state.opened,
          closed: [...(state.closed || []), action.payload]
        };
      } else {
        return state;
      }

    case SNACKBAR_UNREGISTERED:
      return {
        ...state,
        opened: state.opened === action.payload ? undefined : state.opened,
        closed: (state.closed || []).filter(id => id !== action.payload),
        registered: (state.registered || []).filter(snackbar => snackbar.id !== action.payload)
      };

    default:
      return state;
  }
};

export const snackbarReducer: Reducer<SnackbarAwareState> = (
  state = initialState,
  action: Actions
) => ({
  ...state,
  snackbar: snackbarDomainReducer(state.snackbar || initialDomain, action)
});
