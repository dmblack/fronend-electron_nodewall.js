frontend-electron_nodewall.js

A convenient frontend for userspace queued nfqueue packets.


This project is a huge WIP. Please continue with this in mind.

## Requirements
(Listed for Debian)

* build-essentail
* libnetfilter-queue-dev
* lipcap-dev

```
$ sudo apt install build-essential libnetfilter-queue-dev libpcap-dev
```

Obviously; you also require nftables (Note that this should still work with IPTables, you just have to adjust
your iptables syntax - out scope of this project)


## Installation

Clone repository and npm/yarn install.

Attempt, and fail, to install pcap (still works). This is why it's not in package.json.

```
$ npm install pcap
$ yarn add pcap
```

## Getting Started

Queue some packets to userspace

Within: /etc/nftables.testing.nft
Note: This will configure your default input rule to accept all traffic. [Userspace Queue](#userspace-queue)
```
#!/usr/sbin/nft

chain input {
  # Hook and default drop.
  type filter hook input priority 0; policy accept;
  queue num 20
}
```

Load ruleset
```
$ sudo nft -f /etc/nftables.testing.nft
```

This application currently uses Electron, which will throw errors if you installed node with nvm, when
launched as sudo. To combat this; symlink your active (stable.. i hope!) node to your path.
```
$ sudo ln -s "$(which node)" /usr/local/bin/node
```

Launch the application:
Note: See [Privilege Requirements](#privilege-requirements) regarding sudo.
```
$ sudo `which electron` .
```


## FAQ

### Userspace Queue

Note that the userspace queues default to 'accept' if there's nothing readily listening on them. This means;
if you configure and queue packets to `20`, but do not listen on it - packets are accepted.

### Privilege Requirements

Due to the nature of the app, without reconfiguring some permissions not yet documented - the application will
only work if run as sudo.

This is not really surprising, given the application does have raw access to packets.
