/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
const nfq = require('nfqueue');
const IPv4 = require('pcap/decode/ipv4');

let queue=[];

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

ipcMain.on('nfpacket-verdict', function (event, index, verdict) {
  console.log('Attempting to set verdict');
  queue[index - 1].setVerdict(nfq[verdict]);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

nfq.createQueueHandler(20, 65535, function (nfpacket) {
  mainWindow.show();
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
  mainWindow.webContents.send('nfqueuedPacket', { sourceAddress: packet.saddr + ':' + packet.payload.sport, destinationAddress: packet.daddr + ':' + packet.payload.dport}, packet.identification, nfq.NF_ACCEPT, nfq.NF_REJECT, direction)

  // Set packet verdict. Second parameter set the packet mark. 
  // nfpacket.setVerdict(nfq.NF_ACCEPT);

  // Or modify packet and set updated payload 
  // nfpacket.setVerdict(nfq.NF_ACCEPT, null, nfpacket.payload); 
});

nfq.createQueueHandler(10, 65535, function (nfpacket) {
  mainWindow.show();
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
  mainWindow.webContents.send('nfqueuedPacket', { sourceAddress: packet.saddr + ':' + packet.payload.sport, destinationAddress: packet.daddr + ':' + packet.payload.dport }, packet.identification, nfq.NF_ACCEPT, nfq.NF_REJECT, direction)

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
    mainWindow.hide();
  }
}
