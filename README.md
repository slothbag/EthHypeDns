EthHypeDns
==========

A small standalone DNS resolver that will lookup hype domain names using the Ethereum contract from [Etherid.org](http://etherid.org).

This software uses the convention that the ID "key" be hype and the value is the hex value of the ipv6 address.

The simplest way to get up and running is to use DNSMASQ (a great tool anyway) to redirect .hype name resolution to the server running EthHypeDns and Ethereum.

EthHypeDns listens on port 1054, so the line server=/hype/127.0.0.1#1054 in your dnsmasq.conf should be enough.

Make sure Ethereum and EthHypeDns are both running. Currently its hardcoded to expect Ethereum and EthHypeDns on the same machine.

Thats it, your network should be able to resolve hype names with no client changes.

To get started
```
npm install
npm start
```
