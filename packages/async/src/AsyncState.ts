import { AsyncStatus } from './AsyncStatus';

export type AsyncStatusMap = {
  [key: string]: AsyncStatus;
};

export type AsyncTimestampMap = {
  [key: string]: number;
};

export type AsyncState = {
  status: AsyncStatusMap;
  timestamp: AsyncTimestampMap;
};

export type AsyncMountedState = {
  async?: AsyncState;
  [key: string]: any;
};
