import { AsyncActionParams } from './AsyncActionParams';

/**
 * Generates hash from async action params to easily distinguish between different parameters.
 */
function hashAsyncActionParams<
  TParams extends AsyncActionParams = AsyncActionParams
>(params: Partial<TParams>): string {
  const keys = Object.keys(params);

  // in most cases we will use only one param.
  // we don't have to rebuild params object - we can safe a little bit of computation power
  if (keys.length < 2) {
    return JSON.stringify(params);
  } else {
    // sort params to not rely on keys order
    const sortedParams = keys
      .sort()
      .reduce((reduced, key) => ({ ...reduced, [key]: params[key] }), {});

    return JSON.stringify(sortedParams);
  }
}

/**
 * Generates action key based on action type and params (for example 'UPDATE_USER {"id":1424}')
 * @param type Action type
 * @param params Action params
 */
export function getAsyncActionKey<
  TParams extends AsyncActionParams = AsyncActionParams
>(type: string, params?: Partial<TParams>): string {
  if (params) {
    return `${type} ${hashAsyncActionParams(params)}`;
  } else {
    return type;
  }
}
