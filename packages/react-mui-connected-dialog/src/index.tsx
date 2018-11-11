import { closeModal, isModalOpen, getModalParams } from '@proto-api/redux-modal';
import { DialogProps } from 'material-ui';
import Dialog from 'material-ui/Dialog';
import { Component, ComponentClass, ReactElement, SFC } from 'react';
import { connect } from 'react-redux';
import * as React from 'react';

export namespace ConnectedDialog {
  export type StateProps = {
    open: boolean;
    params: any;
  };
  export type DispatchProps = {
    onRequestClose: () => void;
  };
  export type OwnProps = Partial<DialogProps> & {
    name: string;
    content?: (open: boolean, params: any) => ReactElement<any>;
    onOpen?: () => void;
    onClose?: () => void;
  };
  export type Props = StateProps & DispatchProps & OwnProps;
}

class ConnectedDialogPure extends Component<ConnectedDialog.Props> {
  componentDidUpdate(prevProps: ConnectedDialog.Props) {
    if (!prevProps.open && this.props.open && this.props.onOpen) {
      this.props.onOpen();
    }

    if (prevProps.open && !this.props.open && this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { name, content, params, ...dialogProps } = this.props;

    return (
      <Dialog {...dialogProps}>
        {content ? content(dialogProps.open, params) : dialogProps.children}
      </Dialog>
    );
  }
}
const ConnectedDialog = connect(
  (state, ownProps: ConnectedDialog.OwnProps): ConnectedDialog.StateProps => ({
    open: isModalOpen(ownProps.name)(state),
    params: getModalParams(ownProps.name)(state)
  }),
  (dispatch): ConnectedDialog.DispatchProps => ({
    onRequestClose: () => dispatch(closeModal())
  })
)(ConnectedDialogPure) as ComponentClass<ConnectedDialog.OwnProps>;

export default ConnectedDialog;
