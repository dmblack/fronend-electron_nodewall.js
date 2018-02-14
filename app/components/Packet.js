// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
const ipc = require('electron').ipcRenderer
const remote = require('electron').remote
const nfAccept = document.getElementById('nfpacket-accept')
const nfReject = document.getElementById('nfpacket-reject')
const setVerdict = remote.require('./main.dev.js').setVerdict

type Props = {
  insert: () => void,
  remove: () => void,
  packet: Array<mixed>
};

let packets = [];

// nfAccept.addEventListener('click', function () {
//   setVerdict(document.getElementById('nfpacket-id').innerHTML, 1);
//   document.getElementById('nfpacket-queued').innerHTML = '';
//   document.getElementById('nfpacket-id').innerHTML = '';
// })

// nfReject.addEventListener('click', function () {
//   setVerdict(document.getElementById('nfpacket-id').innerHTML, 4);
//   document.getElementById('nfpacket-queued').innerHTML = '';
//   document.getElementById('nfpacket-id').innerHTML = '';
// })

export default class Packet extends Component<Props> {
  props: Props;

  render() {
    const {
      insert, remove, packet, packets
    } = this.props;

    ipc.on('nfqueuedPacket', function (event, nfPacket, index, accept, reject, direction) {
      const packet = `${direction}: ${JSON.stringify(nfPacket)}`
      const packetId = `${index}`;
      console.log('Received Packet!');
      // document.getElementById('nfpacket-queued').innerHTML = packet;
      // document.getElementById('nfpacket-id').innerHTML = packetId;
      // setVerdict(nfPacket.id, accept)
      //ourPacket.setVerdict(accept)
      // ipc.send('nfpacket-verdict', index, accept);
      insert(Object.assign({}, { description: packet, index, packet: nfPacket }));
    });

    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`packet ${styles.packet}`} data-tid="packet">
          {packet}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={remove} data-tclass="btn">
            <i className="fa fa-minus" />
          </button>
        </div>
      </div>
    );
  }
}
