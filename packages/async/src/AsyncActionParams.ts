/**
 * Flat key-value map of scalar values.
 * It's used for tracking async state of multiple resources
 * (for example you can keep track of each user in users list by using userId as a parameter)
 */
export type AsyncActionParams = {
  [key: string]: string | number | boolean;
};
