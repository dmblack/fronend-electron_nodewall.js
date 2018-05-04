// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const setVerdict = remote.require('../app/main.dev').setVerdict;

const nfAccept = 0;
const nfReject = 4;

type Props = {
  insert: () => void,
  remove: () => void,
  packet: Array<mixed>
};

export default class Packet extends Component<Props> {
  constructor() {
    super();

    this.handleNewQueuedPacket = this.handleNewQueuedPacket.bind(this);
    // this.applyPacketVerdict = this.applyPacketVerdict.bind(this);
  }
  props: Props;

  componentDidMount () {
    ipc.on('nfqueuedPacket', this.handleNewQueuedPacket);
  }

  handleNewQueuedPacket (event, nfPacket) {
    const packetDescription = `${JSON.stringify(nfPacket)}`
    const packetId = `${nfPacket.identification}`;
    this.props.insert(nfPacket)
  }

  acceptPacket = (packet, event) => {
    console.log(event);
    setVerdict(packet, nfAccept);
    this.props.remove(packet) // `${packet.version}${packet.protocol}${packet.identification}`)
  }

  rejectPacket = (packet, event) => {
    console.log(event);
    setVerdict(packet, nfReject);
    this.props.remove(packet) // `${packet.version}${packet.protocol}${packet.identification}`)
  }
  
  render () {
    const {
      insert, remove, packet
    } = this.props;

    const PacketList = (props) => {
      let packets = props.packets;
      let packetList;
      if (packets.length > 500) {
        packetList = packets.map((packet => {
          console.log(`${packet.version}${packet.protocol}${packet.identification}`);
          return (
            <li key={`${packet.version}${packet.protocol}${packet.identification}`}>
              <button name={nfAccept} data-tclass="btn" className={styles.btn} id={`${packet.version}${packet.protocol}${packet.identification}`} onClick={this.acceptPacket.bind(this)}>
                <i name={nfAccept} className="fa fa-plus" />
              </button>
              <button name={nfReject} data-tclass="btn" className={styles.btn} id={`${packet.version}${packet.protocol}${packet.identification}`} onClick={this.rejectPacket.bind(this)}>
                <i name={nfReject} className="fa fa-minus" />
              </button>
            </li>
          )
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
