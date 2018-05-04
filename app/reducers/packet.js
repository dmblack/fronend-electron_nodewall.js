// @flow
import { PACKET_INSERT, PACKET_REMOVE } from '../actions/packet';

export type packetStateType = {
  +packet: Array<mixed>
};

type actionType = {
  +type: string,
  +value: object
};

export default function packet(state: Array<mixed> = [], action: actionType) {
  switch (action.type) {
    case PACKET_INSERT:
      let newPacket = [];
      newPacket[`${action.value.version}${action.value.protocol}${action.value.identification}`] = action.value
      state = state.concat(newPacket);
      return state;
      break;
    case PACKET_REMOVE:
      let newState = state.splice(action.value, 1);
      return newState;
      break;
  default:
      return state;
  }
}
