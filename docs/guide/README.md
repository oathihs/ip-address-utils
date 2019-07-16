<!-- ---
sidebar: auto
--- -->

## Quickstart

### Using as ES module

npm:

```bash
npm install ip-address-utils --save
```

yarn:

```bash
yarn add ip-address-utils
```

### Using in browser

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
