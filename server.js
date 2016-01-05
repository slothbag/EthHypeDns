"use strict";

var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

var etherid_abi = [{"constant":true,"inputs":[],"name":"root_domain","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"uint256"}],"name":"getDomain","outputs":[{"name":"owner","type":"address"},{"name":"expires","type":"uint256"},{"name":"price","type":"uint256"},{"name":"transfer","type":"address"},{"name":"next_domain","type":"uint256"},{"name":"root_id","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"n_domains","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"uint256"},{"name":"id","type":"uint256"}],"name":"getId","outputs":[{"name":"v","type":"uint256"},{"name":"next_id","type":"uint256"},{"name":"prev_id","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"price","type":"uint256"},{"name":"transfer","type":"address"}],"name":"changeDomain","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"uint256"},{"name":"name","type":"uint256"},{"name":"value","type":"uint256"}],"name":"changeId","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"domain","type":"uint256"},{"indexed":false,"name":"id","type":"uint256"}],"name":"DomainChanged","type":"event"}];

var etherid_contract = web3.eth.contract(etherid_abi);

var etheridContractInstance = etherid_contract.at('0x3589d05a1ec4af9f65b0e5554e645707775ee43c');

function lookup_domain(domain) {
	var domain_hex = "0x" + asciiToHex(domain);
	var id_hex = "0x" + asciiToHex("hype");

	var domain = web3.toBigNumber( domain_hex );
	var id = web3.toBigNumber( id_hex );

	var test = etheridContractInstance.getId(domain, id);
	var address = web3.toHex(test[0]);
	address = address.substring(2);
	address = address.replace(/(.{4})/g, "$1:");
	address = address.slice(0,-1);
	return address;
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var dns = require('native-dns'),
  tcpserver = dns.createTCPServer(),
  server = dns.createServer();

var onMessage = function (request, response) {
  console.log('request from:', request.address);
  var i;
  //console.log(request)
  var domain = request.question[0].name;
  if (!domain.endsWith(".hype")) {
    response.header.rcode = dns.NOTFOUND;
    response.send();
    return;
  }
  else {
    domain = domain.substring(0, domain.length - 5);
  }

  // Do web3 lookup against etherid.org contract
  var found_address = lookup_domain(domain);
  //console.log(found_address);

  if (found_address == "") {
    response.header.rcode = dns.NOTFOUND;
    response.send();
    return;
  }

  response.answer.push(dns.AAAA({
    name: request.question[0].name,
    address: found_address,
    ttl: 600,
  }));

  response.send();
};

var onError = function (err, buff, req, res) {
  console.log(err.stack);
};

var onListening = function () {
  console.log('server listening on', this.address());
  //this.close();
};

var onSocketError = function (err, socket) {
  console.log(err);
};

var onClose = function () {
  console.log('server closed', this.address());
};

server.on('request', onMessage);
server.on('error', onError);
server.on('listening', onListening);
server.on('socketError', onSocketError);
server.on('close', onClose);

server.serve(1054, '127.0.0.1');

tcpserver.on('request', onMessage);
tcpserver.on('error', onError);
tcpserver.on('listening', onListening);
tcpserver.on('socketError', onSocketError);
tcpserver.on('close', onClose);

tcpserver.serve(1054, '127.0.0.1');


function asciiToHex( arr ) {
    var str ='';
    for(var i = 0; i < arr.length ; i++) {
        var n = arr.charCodeAt(i);
        str += (( n < 16) ? "0":"") + n.toString(16);
    }
    return str;
}
