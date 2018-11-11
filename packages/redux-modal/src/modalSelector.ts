import { createSelector, Selector } from 'reselect';
import { ModalAwareState } from './ModalState';
import memoize from 'fast-memoize';

export const getModalState: Selector<ModalAwareState, ModalAwareState['modal']> = state =>
  (state && state.modal) || null;

export const getModalName = createSelector(getModalState, modal => modal && modal.name);

export const getCurrentModalParams = createSelector(
  getModalState,
  modal => (modal && modal.params) || {}
);

export const getModalParams = memoize((modalName: string) =>
  createSelector(
    getModalName,
    getCurrentModalParams,
    (name, params: any) => modalName === name ? params : {} as any
  )
);

export const getModalParam = memoize((modalName: string, paramName: string) =>
  createSelector(
    getModalName,
    getCurrentModalParams,
    (name, params: any) => modalName === name ? params[paramName] : undefined
  )
);

export const isModalOpen = memoize((modalName: string) =>
  createSelector(getModalName, currentModalName => currentModalName === modalName)
);

export const isModalClosed = memoize((modalName: string) =>
  createSelector(isModalOpen(modalName), isOpen => !isOpen)
);
