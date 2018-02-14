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
  let newState;
  console.log(action);
  switch (action.type) {
    case PACKET_INSERT:
      newState = state;
      newState.push(action.value);
      return newState;
    case PACKET_REMOVE:
      newState = state;
      newState.push({"test":"test"});
      return newState;
  default:
      return state;
  }
}
