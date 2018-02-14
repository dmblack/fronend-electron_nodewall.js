import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Packet from '../components/Packet';
import * as PacketActions from '../actions/packet';

function mapStateToProps(state) {
  return {
    packet: state.packet
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PacketActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Packet);
