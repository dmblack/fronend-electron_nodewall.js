// @flow
import type { packetStateType } from '../reducers/packet';

type actionType = {
  +type: string
};

type actionValue = {
  +value: object
}

export const PACKET_INSERT = 'PACKET_INSERT';
export const PACKET_REMOVE = 'PACKET_REMOVE';

export function insert(value) {
  return {
    type: PACKET_INSERT,
    value
  };
}

export function remove() {
  return {
    type: PACKET_REMOVE
  };
}

