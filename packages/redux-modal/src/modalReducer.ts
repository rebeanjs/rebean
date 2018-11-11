import { ModalAwareState } from './ModalState';
import { CLOSE_MODAL, OPEN_MODAL, UPDATE_MODAL, Actions } from './modalAction';

export const modalReducer = (
  state: ModalAwareState = { modal: null },
  action: Actions
) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        modal: action.payload || state.modal
      };

    case UPDATE_MODAL:
      if (state.modal && action.payload) {
        return {
          ...state,
          modal: {
            name: state.modal.name,
            params: action.payload
          }
        };
      } else {
        return state;
      }

    case CLOSE_MODAL:
      return {
        ...state,
        modal: null
      };

    default:
      return state;
  }
};
