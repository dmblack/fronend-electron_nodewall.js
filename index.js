var nfq = require('nfqueue');
var IPv4 = require('pcap/decode/ipv4');
var counter = 0;
 
nfq.createQueueHandler(1, 65535, function(nfpacket) {
  console.log("-- packet received --");
  console.log(JSON.stringify(nfpacket.info, null, 2));
 
  // Decode the raw payload using pcap library 
  var packet = new IPv4().decode(nfpacket.payload, 0);
  // Protocol numbers, for example: 1 - ICMP, 6 - TCP, 17 - UDP 
  console.log(
    "src=" + packet.saddr + ", dst=" + packet.daddr
    + ", proto=" + packet.protocol
  );
 
  // Set packet verdict. Second parameter set the packet mark. 
  nfpacket.setVerdict((counter++ % 2) ? nfq.NF_DROP : nfq.NF_ACCEPT);
 
  // Or modify packet and set updated payload 
  // nfpacket.setVerdict(nfq.NF_ACCEPT, null, nfpacket.payload); 
});
