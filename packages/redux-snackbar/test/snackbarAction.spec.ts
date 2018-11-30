
import {snackbarRegistered, snackbarOpened, snackbarClosed, snackbarUnregistered,} from '@rebean/redux-snackbar';

describe('SnackbarAction', () => {

  it('should create SNACKBAR_REGISTERED action', () => {
    expect(snackbarRegistered).toBeDefined();
    expect(
      snackbarRegistered({
        id: 'some_unique_id',
        message: 'Hello world'
      })
    ).toEqual({
      type: '@@redux-snackbar/SNACKBAR_REGISTERED',
      payload: {
        id: 'some_unique_id',
        message: 'Hello world'
      }
    });
    expect(
      snackbarRegistered({
        id: 'some_unique_id',
        message: 'Hello world',
        timeout: 5000,
        timeoutId: 6432
      })
    ).toEqual({
      type: '@@redux-snackbar/SNACKBAR_REGISTERED',
      payload: {
        id: 'some_unique_id',
        message: 'Hello world',
        timeout: 5000,
        timeoutId: 6432
      }
    });
  });

  it('should create SNACKBAR_OPENED action', () => {
    expect(snackbarOpened).toBeDefined();
    expect(
      snackbarOpened('some_unique_id')
    ).toEqual({
      type: '@@redux-snackbar/SNACKBAR_OPENED',
      payload: {
        id: 'some_unique_id'
      }
    });
    expect(
      snackbarOpened('another_unique_id', 6432)
    ).toEqual({
      type: '@@redux-snackbar/SNACKBAR_OPENED',
      payload: {
        id: 'another_unique_id',
        timeoutId: 6432
      }
    })
  });

  it('should create SNACKBAR_CLOSED action', () => {
    expect(snackbarClosed).toBeDefined();
    expect(snackbarClosed('another_unique_id')).toEqual({
      type: '@@redux-snackbar/SNACKBAR_CLOSED',
      payload: 'another_unique_id'
    })
  });

  it('should create SNACKBAR_UNREGISTERED action', () => {
    expect(snackbarUnregistered).toBeDefined();
    expect(snackbarUnregistered('some_unique_id')).toEqual({
      type: '@@redux-snackbar/SNACKBAR_UNREGISTERED',
      payload: 'some_unique_id'
    })
  });


});
