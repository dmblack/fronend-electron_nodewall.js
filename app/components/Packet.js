// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const nfAccept = document.getElementById('nfpacket-accept');
const nfReject = document.getElementById('nfpacket-reject');
const setVerdict = remote.require('./main.dev.js').setVerdict;

type Props = {
  insert: () => void,
  remove: () => void,
  packet: Array<mixed>
};

export default class Packet extends Component<Props> {
  constructor() {
    super();

    this.handlePacket = this.handlePacket.bind(this);
  }
  props: Props;

  componentDidMount () {
    ipc.on('nfqueuedPacket', this.handlePacket);
  }

  handlePacket (event, nfPacket, index, accept, reject, direction) {
    const packetDescription = `${direction}: ${JSON.stringify(nfPacket)}`
    const packetId = `${index}`;
    this.props.insert(Object.assign({}, { description: packetDescription, index, packet: nfPacket }))
  }
  
  render () {
    const {
      insert, remove, packet
    } = this.props;

    const PacketList = (props) => {
      let packets = props.packets;
      let packetList;
      if (packets.length > 0) {
        packetList = packets.map((packet => {
          <li key={packets.index}>
            {packet.description}
            <button data-tclass="btn" className={styles.btn}>
              <i className="fa fa-plus" />
            </button>
            <button data-tclass="btn" className={styles.btn}>
              <i className="fa fa-minus" />
            </button>
          </li>
        }))
      } else { packetList = null }
      return packetList;
    };

    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`packet ${styles.packet}`} data-tid="packet">
          <ul><PacketList packets={packet} /></ul>
          <pre>{packet.length}</pre>
        </div>
      </div>
    );
  }
}
