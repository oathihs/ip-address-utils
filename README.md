# ip-address-utils

📘 [Documentation](https://oathihs.github.io/ip-address-utils/)

## Installation

npm:

```bash
    $ npm install ip-address-utils --save
```

yarn:

```bash
    $ yarn add ip-address-utils
```

browser:

```html
<script src="ip-address-utils/dist/ip-address-utils.umd.min.js"></script>

<script>
  window.ipAddressUtils.ipv4.subnet('192.168.0.1/26');
  // {
  //   bitmask: 26,
  //   netmask: '255.255.255.192',
  //   hostCount: 62,
  //   networkAddress: '192.168.0.0',
  //   broadcastAddress: '192.168.0.63',
  //   firstHost: '192.168.0.1',
  //   lastHost: '192.168.0.62'
  // }
</script>
```

## Usage

```js
import { ipv4 } from 'ip-address-utils';

ipv4.isValid('192.168.1.0'); // true
ipv4.isSubnet('192.168.1.0/24'); // true
ipv4.isIpHost('192.168.1.0'); // true
ipv4.isValidIpRange('0.0.0.1-192.168.1.191', {
  subnet: '192.168.1.134/26'
}); // false
ipv4.toBuffer('192.168.0.1'); // new Buffer([192.168.0.1])
ipv4.fromBuffer(new Buffer([192, 168, 0, 1])); // '192.168.0.1'
ipv4.toBitmask('255.255.0.0'); // 16
ipv4.fromBitmask(16); //'255.255.0.0'
ipv4.toDecimal('192.168.0.1'); // 3232235521
ipv4.fromDecimal(3232235521); // '192.168.0.1'
ipv4.subnet('192.168.0.1/26');
// {
//   bitmask: 26,
//   netmask: '255.255.255.192',
//   hostCount: 62,
//   networkAddress: '192.168.0.0',
//   broadcastAddress: '192.168.0.63',
//   firstHost: '192.168.0.1',
//   lastHost: '192.168.0.62'
// }
```

> IPv6 is still WIP
