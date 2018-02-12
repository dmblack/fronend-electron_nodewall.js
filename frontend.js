const ipc = require('electron').ipcRenderer
const remote = require('electron').remote
const nfAccept = document.getElementById('nfpacket-accept')
const nfReject = document.getElementById('nfpacket-reject')
const setVerdict = remote.require('./index.js').setVerdict

nfAccept.addEventListener('click', function () {
  setVerdict(document.getElementById('nfpacket-id').innerHTML, 1);
  document.getElementById('nfpacket-queued').innerHTML = '';
  document.getElementById('nfpacket-id').innerHTML = '';
})

nfReject.addEventListener('click', function () {
  setVerdict(document.getElementById('nfpacket-id').innerHTML, 4);
  document.getElementById('nfpacket-queued').innerHTML = '';
  document.getElementById('nfpacket-id').innerHTML = '';
})

ipc.on('nfqueuedPacket', function (event, nfPacket, index, accept, reject, direction) {
  const packet = `${direction}: ${JSON.stringify(nfPacket)}`
  const packetId = `${index}`;
  document.getElementById('nfpacket-queued').innerHTML = packet;
  document.getElementById('nfpacket-id').innerHTML = packetId;
  // setVerdict(nfPacket.id, accept)
  //ourPacket.setVerdict(accept)
  // ipc.send('nfpacket-verdict', index, accept);
});

ipc.on('asynchronous-reply', function (event, arg) {
  const message = `Asynchronous message reply: ${arg}`
  document.getElementById('async-reply').innerHTML = message
})
