---
sidebar: auto
---

# API

## IPv4

```javascript
import { ipv4 } from 'ip-address-utils';
```

### isValid

#### `ipv4.isValid(address)`

#### Arguments

- {string} **address**: An IPv4 address string.

#### Returns

- {boolean}: Returns `true` if `address` is a valid IPv4 address, else false.

#### Usage

```javascript
ipv4.isValid('192.168.1.0'); // true
ipv4.isValid('192.168.1.0/255.255.255.0'); // true
ipv4.isValid('192.168.1.0/24'); // true
ipv4.isValid('192.168.1.0 255.255.255.0'); // true
```

<br/>

---

<br/>

### isSubnet

#### `ipv4.isSubnet(subnet)`

#### Arguments

- {string} **subnet**: An IPv4 IP address and netmask string (address/netmask or address/cidr).

#### Returns

- {boolean}: Returns `true` if `subnet` is a valid IPv4 subnet, else false.

#### Usage

```javascript
ipv4.isSubnet('192.168.1.0/24'); // true
ipv4.isSubnet('192.168.1.0/255.255.255.0'); // true
ipv4.isSubnet('192.168.1.0'); // false
```

<br/>

---

<br/>

### isIpHost

#### `ipv4.isIpHost(address)`

#### Arguments

- {string} **address**: An IPv4 IP address string.

#### Returns

- {boolean}: Returns `true` if `address` is a valid IPv4 IP address, else false.

#### Usage

```javascript
ipv4.isIpHost('192.168.1.0'); // true
ipv4.isIpHost('192.168.1.0/24'); // false
```

<br/>

---

<br/>

### isValidIpRange

#### `ipv4.isValidIpRange(range, [options])`

#### Arguments

- {string} **range**: An IPv4 IP range string.
- {Object} **options**:

  - {boolean} **withSpace**:

    If set to `true`, spaces between `startIp` and `endIp` is required, e.g. `startIp - endIp`.

    If set to `false`, spaces should NOT be included, e.g. `startIp-endIp`.

    If not set, either format will be valid.

  - {string} subnet: If provided, validate if the given IP range is in the subnet.

#### Returns

- {boolean}: Returns `true` if `range` is a valid IPv4 IP range, else false.

#### Usage

```javascript
ipv4.isValidIpRange('0.0.0.0-0.0.0.1'); // true
ipv4.isValidIpRange('0.0.0.0 - 0.0.0.1'); // true
ipv4.isValidIpRange('0.0.0.1-0.0.0.0'); // false, endIp should be greater than startIp
ipv4.isValidIpRange('0.0.0.0 - 0.0.0.1', {
  withSpace: false
}); // false
ipv4.isValidIpRange('0.0.0.1-192.168.1.191', {
  withSpace: true,
  subnet: '192.168.0.1/26'
}); // false,  IP address is outside of subnet range
```

<br/>

---

<br/>

<!-- ### validateIpRange

#### `ipv4.validateIpRange(range, [options])`

#### Arguments

- {string} **range**: An IPv4 IP range string
- {Object} **options**:

  - {boolean} withSpace:

    If set to `true`, spaces between `startIp` and `endIp` is required, e.g. `startIp - endIp`

    If set to `false`, spaces should not be included, e.g. `startIp-endIp`,

    If not set, either format will be valid

* {string} subnet: If provided, validate if the given IP range is in the subnet

#### Returns

- {string}: Returns the given IP range if it's valid, otherwise an error will be thrown

#### Usage

```javascript
ipv4.validateIpRange('0.0.0.0 - 0.0.0.1', {
  withSpace: false
}); // throw error: 'End IP should be greater than Start IP'

ipv4.validateIpRange('0.0.0.1-192.168.1.191', {
  withSpace: true,
  subnet: '192.168.0.1/26'
}); // throw error: 'IP address is outside of subnet range'
```

<br/>

---

<br/> -->

### toBuffer

#### `ipv4.toBuffer(address)`

#### Arguments

- {string} **address**: An IPv4 IP address string.

#### Returns

- {Array}: An array of bytes.

#### Usage

```javascript
ipv4.toBuffer('192.168.0.1'); // [192, 168, 0, 1]
```

<br/>

---

<br/>

### fromBuffer

#### `ipv4.fromBuffer(buffer)`

#### Arguments

- {string} **buffer**: An array of bytes.

#### Returns

- {string}: An IPv4 IP address string.

#### Usage

```javascript
ipv4.fromBuffer([192, 168, 0, 1]); // '192.168.0.1'
```

<br/>

---

<br/>

### toBitmask

#### `ipv4.toBitmask(address)`

#### Arguments

- {string} **address**: An IPv4 IP address string.

#### Returns

- {number}: A bitmask.

#### Usage

```javascript
ipv4.toBitmask('255.255.0.0'); // 16
```

<br/>

---

<br/>

### fromBitmask

#### `ipv4.fromBitmask(mask)`

#### Arguments

- {number} **mask**: A bitmask.

#### Returns

- {string}: An IPv4 IP address string.

#### Usage

```javascript
ipv4.fromBitmask(16); //'255.255.0.0'
```

<br/>

---

<br/>

### toDecimal

#### `ipv4.toDecimal(address)`

#### Arguments

- {string} **address**: An IPv4 IP address string.

#### Returns

- {number}: The decimal format of given IP address.

#### Usage

```javascript
ipv4.toDecimal('192.168.0.1'); // 3232235521
```

<br/>

---

<br/>

### fromDecimal

#### `ipv4.fromDecimal(decimal)`

#### Arguments

- {number} **decimal**: A decimal IP address.

#### Returns

- {string}: The IPv4 IP address string of given decimal.

#### Usage

```javascript
ipv4.fromDecimal(3232235521); // '192.168.0.1'
```

<br/>

---

<br/>

### subnet

#### `ipv4.subnet(address)`

#### Arguments

- {string} **address**: An IPv4 address string.

#### Returns

- {Object}: The subnet information object:

  - {string} **networkAddress**: The network address.
  - {string} **broadcastAddress**: The broadcast address.
  - {number} **bitmask**: The bitmask.
  - {string} **netmask**: The netmask.
  - {number} **hostCount**: The count of usable hosts.
  - {string} **firstHost**: The first host of usable hosts.
  - {string} **lastHost**: The last host of usable hosts.

#### Usage

```javascript
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

<br/>

---

<br/>
