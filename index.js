const nfq = require('nfqueue');
const IPv4 = require('pcap/decode/ipv4');
const { app, BrowserWindow } = require('electron')
const ipcMain = require('electron').ipcMain
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let queue = [];

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 300, height: 200, frame: false })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools();

  win.setPosition(9999, 0, false);
  win.setAlwaysOnTop(true);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('nfpacket-verdict', function (event, index, verdict) {
  console.log('Attempting to set verdict');
  queue[index - 1].setVerdict(nfq[verdict]);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

nfq.createQueueHandler(20, 65535, function (nfpacket) {
  let direction = 'OUTGOING'

  console.log("-- packet received --");
  // console.log(JSON.stringify(nfpacket.info, null, 2));

  // Decode the raw payload using pcap library 
  let packet = new IPv4().decode(nfpacket.payload, 0);

  // Protocol numbers, for example: 1 - ICMP, 6 - TCP, 17 - UDP 
  // console.log(
  //   "src=" + packet.saddr + ", dst=" + packet.daddr
  //   + ", proto=" + packet.protocol
  // );

  queue[packet.identification] = nfpacket
  console.log(packet.identification);
  win.webContents.send('nfqueuedPacket', { sourceAddress: packet.saddr + ':' + packet.payload.sport, destinationAddress: packet.daddr + ':' + packet.payload.dport}, packet.identification, nfq.NF_ACCEPT, nfq.NF_REJECT, direction)

  // Set packet verdict. Second parameter set the packet mark. 
  // nfpacket.setVerdict(nfq.NF_ACCEPT);

  // Or modify packet and set updated payload 
  // nfpacket.setVerdict(nfq.NF_ACCEPT, null, nfpacket.payload); 
});


nfq.createQueueHandler(10, 65535, function (nfpacket) {
  let direction = 'INCOMMING'

  console.log("-- packet received --");
  // console.log(JSON.stringify(nfpacket.info, null, 2));

  // Decode the raw payload using pcap library 
  let packet = new IPv4().decode(nfpacket.payload, 0);

  // Protocol numbers, for example: 1 - ICMP, 6 - TCP, 17 - UDP 
  // console.log(
  //   "src=" + packet.saddr + ", dst=" + packet.daddr
  //   + ", proto=" + packet.protocol
  // );

  queue[packet.identification] = nfpacket
  console.log(packet.identification);
  win.webContents.send('nfqueuedPacket', { sourceAddress: packet.saddr + ':' + packet.payload.sport, destinationAddress: packet.daddr + ':' + packet.payload.dport}, packet.identification, nfq.NF_ACCEPT, nfq.NF_REJECT, direction)

  // Set packet verdict. Second parameter set the packet mark. 
  // nfpacket.setVerdict(nfq.NF_ACCEPT);

  // Or modify packet and set updated payload 
  // nfpacket.setVerdict(nfq.NF_ACCEPT, null, nfpacket.payload); 
});

exports.setVerdict = (id, verdict) => {
  console.log('Verdict Set');

  switch (verdict) {
    case 4:
      queue[id].setVerdict(verdict, 666)
    default:
      queue[id].setVerdict(verdict);
  }
  // queue[id].setVerdict(verdict);
  // queue.splice(id, 1);

  // console.log(queue.length);

  // if (queue[queue.length] !== 0)
  // {
  //   let targetPacket = queue[queue.length - 1];
  //   win.webContents.send('nfqueuedPacket', { sourceAddress: targetPacket.saddr + ':' + targetPacket.payload.sport, destinationAddress: targetPacket.daddr + ':' + targetPacket.payload.dport}, targetPacket.identification, nfq.NF_ACCEPT, nfq.NF_REJECT, direction)
  // }
}
