export const OPEN_MODAL = '@@rebean/redux-modal/OPEN_MODAL';
export type OpenModalAction<P = {}> = {
  type: typeof OPEN_MODAL;
  payload: { name: string; params: P };
};
export const openModal = <P = {}>(name: string, params: P = {} as P): OpenModalAction<P> => ({
  type: OPEN_MODAL,
  payload: { name, params }
});

export const UPDATE_MODAL = '@@rebean/redux-modal/UPDATE_MODAL';
export type UpdateModalAction<P = {}> = {
  type: typeof UPDATE_MODAL;
  payload: { params: P };
};
export const updateModal = <P = {}>(params: P): UpdateModalAction<P> => ({
  type: UPDATE_MODAL,
  payload: { params }
});

export const CLOSE_MODAL = '@@rebean/redux-modal/CLOSE_MODAL';
export type CloseModalAction = {
  type: typeof CLOSE_MODAL
};
export const closeModal = (): CloseModalAction => ({
  type: CLOSE_MODAL
});

export type Actions = OpenModalAction | UpdateModalAction | CloseModalAction;
