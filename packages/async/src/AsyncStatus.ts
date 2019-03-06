export enum AsyncStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export namespace AsyncStatus {
  /**
   * All available statuses.
   */
  const ALL = [AsyncStatus.PENDING, AsyncStatus.RESOLVED, AsyncStatus.REJECTED];

  /**
   * Checks if given status is a valid status.
   */
  export function isValid(status: any): status is AsyncStatus {
    return ALL.indexOf(status) !== -1;
  }

  /**
   * Combines many async statuses into one status. Uses similar logic to Promise.all()
   *
   * @param statuses Async statuses to combine
   */
  export function all(
    ...statuses: (AsyncStatus | undefined)[]
  ): AsyncStatus | undefined {
    // is at least one status is undefined, return undefined
    if (statuses.indexOf(undefined) !== -1) {
      return undefined;
    }

    // if at least one status is rejected, return rejected
    if (statuses.indexOf(AsyncStatus.REJECTED) !== -1) {
      return AsyncStatus.REJECTED;
    }

    // if at least one status is pending, return pending
    if (statuses.indexOf(AsyncStatus.PENDING) !== -1) {
      return AsyncStatus.PENDING;
    }

    // if all statuses are resolved, return resolved
    if (statuses.every(status => status === AsyncStatus.RESOLVED)) {
      return AsyncStatus.RESOLVED;
    }

    // in other case, return undefined
    return undefined;
  }
}
