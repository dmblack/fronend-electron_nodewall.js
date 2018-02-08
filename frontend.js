const ipc = require('electron').ipcRenderer
const remote = require('electron').remote
const nfAccept = document.getElementById('nfpacket-accept')
const nfReject = document.getElementById('nfpacket-reject')


nfAccept.addEventListener('click', function () {
  ipc.send('nfpacket-verdict', 'accept')
})

nfReject.addEventListener('click', function () {
  ipc.send('nfpacket-verdict', 'reject')
})

ipc.on('nfqueuedPacket', function (event, nfPacket, index, accept, reject) {
  const packet = `Packet Received: ${JSON.stringify(nfPacket)}`
  document.getElementById('nfpacket-queued').innerHTML = packet;
  // ourPacket.setVerdict(accept)
  ipc.send('nfpacket-verdict', index, accept);
});

ipc.on('asynchronous-reply', function (event, arg) {
  const message = `Asynchronous message reply: ${arg}`
  document.getElementById('async-reply').innerHTML = message
})
