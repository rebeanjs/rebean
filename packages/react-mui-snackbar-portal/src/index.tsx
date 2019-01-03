import MuiSnackbar from 'material-ui/Snackbar';
import * as React from 'react';
import { ComponentClass, Component, SFC } from 'react';
import { connect } from 'react-redux';
import {
  Snackbar,
  SnackbarAwareState,
  Actions,
  closeSnackbar,
  getRegisteredSnackbars,
  getOpenedSnackbarId
} from '@rebean/redux-snackbar';
import { ThunkDispatch } from 'redux-thunk';

export namespace SnackbarPortal {
  export type StateProps = {
    registeredSnackbars: Snackbar[];
    openedSnackbarId: Snackbar['id'] | undefined;
  };
  export type DispatchProps = {
    onClose: (id: Snackbar['id']) => void;
  };
  export type OwnProps = {};
  export type Props = StateProps & DispatchProps & OwnProps;
}

export const SnackbarPortalPure: SFC<SnackbarPortal.Props> = props => (
  <>
    {props.registeredSnackbars.map(snackbar => (
      <MuiSnackbar
        key={snackbar.id}
        message={snackbar.message}
        open={snackbar.id === props.openedSnackbarId}
        onRequestClose={() => props.onClose(snackbar.id)}
      />
    ))}
  </>
);

export const SnackbarPortal = connect(
  (state: SnackbarAwareState): SnackbarPortal.StateProps => ({
    registeredSnackbars: getRegisteredSnackbars(state),
    openedSnackbarId: getOpenedSnackbarId(state)
  }),
  (dispatch: ThunkDispatch<SnackbarAwareState, any, Actions>): SnackbarPortal.DispatchProps => ({
    onClose: (id: Snackbar['id']) => dispatch(closeSnackbar(id))
  })
)(SnackbarPortalPure) as ComponentClass<SnackbarPortal.OwnProps>;


const SomeComponentPure = ({ text, onClick }) =>
  <div onClick={onClick}>{ text }</div>;

const SomeComponent = (props) => {
  const openSnackbar = useSnackbar();

  return <SomeComponentPure
    {...props}
    onClick={() => openSnackbar('Yeee!')}
  />
}
