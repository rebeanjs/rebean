# Redux Snackbar

> Snackbar behavior based on Material Design guidelines

## Instalation

This module is available as a npm package. To start using it, you have to install it first.

```
npm install --save @rebean/redux-snackbar
```

After installing it, you have to add snackbar reducer to your root reducer.

```typescript
import { createStore, combineReducers } from 'redux';
import { snackbarReducer } from '@rebean/redux-snackbar';

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass snackbarReducer under 'snackbar' key,
  snackbar: snackbarReducer,
});

const store = createStore(rootReducer);
```

Now you can connect it to your components - redux knows how to handle snackbar actions.

## Usage

## Contributing

## License

MIT
