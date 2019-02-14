# @rebean/async

> Async utilities for Redux

## Installation

This module is available as a npm package. To start using it, you have to install it first.

```
npm install --save @rebean/async
```

After installing it, you have to add snackbar reducer to your root reducer.

```typescript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {
  asyncReducer,
  asyncMiddleware,
  asyncActionSanitizer
} from '@rebean/async';
import thunkMiddleware from 'redux-thunk';
// if you are using Redux Devtools
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass asyncReducer under 'async' key,
  async: asyncReducer
});

// to block actions that are not in proper chronology
const middlewareEnhancer = applyMiddleware(
  thunkMiddleware,
  asyncMiddleware
  // ...other middleware
);

// to see async action status and parameters in Redux Devtools
const composeEnhancers = composeWithDevTools({
  actionSanitizer: asyncActionSanitizer
});

const enhancer = composeEnhancers(middlewareEnhancer);
const initialState = {};

const store = createStore(rootReducer, initialState, enhancer);
```

Now you can connect it to your components - redux knows how to handle async actions.

## Usage

To define async action you need redux-thunk installed and connected to the store.
The easiest way to create new async action creator is to use `async` function
from this package. Then you have to create reducer - you can use `handle*` higher order
reducers to create your own.

Example of fetching list of users:

```typescript
// store/user/userAction.ts

import { async, AsyncAction } from '@rebean/async';

export const LIST_USERS = 'LIST_USERS';
export type ListUsersAction = AsyncAction<User[]>;
export const listUsers = (): ThunkAction<Promise<User[]>> => dispatch =>
  dispatch(async(LIST_USERS, UserApi.list()));
```

```typescript
// store/user/userReducer.ts
import { handleAsync } from '@rebean/async';
import { combineReducers } from 'redux';
import { LIST_USERS, ListUsersAction } from './userAction';

const listUsersReducer = handleResolved<User[], ListUsersAction>(
  LIST_USERS,
  (state, action) => action.payload,
  []
);

export const userReducer = combineReducers({
  users: listUsersReducer
});
```

```typescript jsx
// component/UserList/UserList.tsx

import { isAsyncPending } from '@rebean/async';
import { LIST_USERS } from '../../store/user/userAction.ts';

export namespace UserList {
  export type StateProps = {
    isLoading: boolean;
    users: User[];
  };
  export type OwnProps = {};
  export type Props = StateProps & OwnProps;
}

const UserListDumb: FC<UserList.Props> = ({ isLoading, users }) => {
  if (isLoading) {
    return 'Loading...';
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export const UserList = connect(state => ({
  isLoading: isAsyncPending(LIST_USERS)(state),
  users: getUsers(state)
}))(UserListDumb);
```

## License

MIT
