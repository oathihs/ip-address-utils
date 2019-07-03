'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// IP subnet (ie. 172.16.79.19/24 or 172.16.79.19/255.255.255.0 or 172.16.1.1)
const IP_SUBNET_REGEX = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])([\/ ]{1}((((254|252|248|240|224|192|128|0).0.0.0)|(255.(254|252|248|240|224|192|128|0).0.0)|(255.255.(254|252|248|240|224|192|128|0).0)|(255.255.255.(255|254|252|248|240|224|192|128|0))|(3[0-2]|2[0-9]|1[0-9]|[0-9]))))?$/;

// subnet only (/ and subnet part are strictly required ie., only accept 172.16.79.19/24 or 172.16.79.19/255.255.255.0)
const SUBNET_REGEX = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/((((254|252|248|240|224|192|128|0)\.0\.0\.0)|(255\.(254|252|248|240|224|192|128|0)\.0\.0)|(255\.255\.(254|252|248|240|224|192|128|0)\.0)|(255\.255\.255\.(255|254|252|248|240|224|192|128|0))|(3[0-2]|2[0-9]|1[0-9]|[0-9])))$/;

// Host (ie. 1.2.3.4)
const IP_HOST_REGEX = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;

// Mask (ie. 255.255.255.0)
const NETMASK_REGEX = /^(((255|254|252|248|240|224|192|128|0)\.0\.0\.0)|(255\.(255|254|252|248|240|224|192|128)\.0\.0)|(255\.255\.(255|254|252|248|240|224|192|128)\.0)|(255\.255\.255\.(255|254|252|248|240|224|192|128|0)))$/;

// Range (IP_HOST-IP_HOST)
const IP_RANGE_REGEX = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])|-((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])|\/(3[0-2]|[1-2][0-9]|[0-9]))?$/;
// Range with spaces (IP_HOST - IP_HOST)
const IP_RANGE_SPACES_REGEX = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])|\s+-\s+((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])|\/(3[0-2]|[1-2][0-9]|[0-9]))?$/;

const INVALID_IPv4 = 'Invalid IPv4 address';
const INVALID_BUFFER = 'Invalid buffer';
const INVALID_IP_DECIMAL = 'Invalid IP decimal';
const IP_DECIMAL_OVERFLOW = 'The IP decimal is out of range';

const INVALID_BITMASK = 'Invalid bitmask';
const INVALID_NETMASK = 'Invalid netmask';
const INVALID_SUBNET = 'Invalid subnet';

const INVALID_IP_RANGE = 'Invalid IP range';
const INVALID_IP_RANGE_START_END = 'End IP should be greater than Start IP';
const IP_RANGE_OVERFLOW = 'IP address is outside of subnet range';

function isValid(value) {
  return IP_SUBNET_REGEX.test(value);
}

function isSubnet(value) {
  return SUBNET_REGEX.test(value);
}

function isIpHost(value) {
  return IP_HOST_REGEX.test(value);
}

// will throw an error if ip range is invalid
function validateIpRange(range, options = { subnet: null, withSpace: null }) {
  let isValid = false;
  const { withSpace } = options;
  switch (true) {
    case withSpace === null || !options.hasOwnProperty('withSpace'):
      isValid = IP_RANGE_REGEX.test(range) || IP_RANGE_SPACES_REGEX.test(range);
      break;
    case withSpace === true:
      isValid = IP_RANGE_SPACES_REGEX.test(range);
      break;
    default:
      isValid = IP_RANGE_REGEX.test(range);
  }

  if (!isValid) {
    throw new Error(`${INVALID_IP_RANGE}: ${range}`);
  } else {
    const rangeList = range.split('-').map(el => el.trim());
    const startIp = rangeList[0];
    const endIp = rangeList[1];
    const startIpDecimal = toDecimal(startIp);
    const endIpDecimal = toDecimal(endIp);
    // the end ip should be equal or greater than start ip
    if (startIpDecimal > endIpDecimal) {
      throw new Error(`${INVALID_IP_RANGE_START_END}`);
    }

    if (options && options.subnet) {
      const _subnet = subnet(options.subnet);
      const firstHostDecimal = toDecimal(_subnet.firstHost);
      const lastHostDecimal = toDecimal(_subnet.lastHost);

      if (startIpDecimal < firstHostDecimal || endIpDecimal > lastHostDecimal) {
        throw new Error(`${IP_RANGE_OVERFLOW}`);
      }
    }
  }

  return range;
}

function isValidIpRange(range, options = { subnet: null, withSpace: null }) {
  let isValid = false;
  const { withSpace } = options;

  switch (true) {
    case withSpace === null || !options.hasOwnProperty('withSpace'):
      isValid = IP_RANGE_REGEX.test(range) || IP_RANGE_SPACES_REGEX.test(range);
      break;
    case withSpace === true:
      isValid = IP_RANGE_SPACES_REGEX.test(range);
      break;
    default:
      isValid = IP_RANGE_REGEX.test(range);
  }

  if (isValid) {
    const rangeList = range.split('-').map(el => el.trim());
    const startIp = rangeList[0];
    const endIp = rangeList[1];
    const startIpDecimal = toDecimal(startIp);
    const endIpDecimal = toDecimal(endIp);
    // the end ip should be equal or greater than start ip
    isValid = startIpDecimal <= endIpDecimal;

    if (options && options.subnet) {
      const _subnet = subnet(options.subnet);
      const firstHostDecimal = toDecimal(_subnet.firstHost);
      const lastHostDecimal = toDecimal(_subnet.lastHost);

      isValid = startIpDecimal >= firstHostDecimal && endIpDecimal <= lastHostDecimal;
    }
  }

  return isValid;
}

function toBuffer(ip) {
  try {
    return ip.split(/\./g).reduce(
      (result, octet, i) => {
        result[i] = parseInt(octet, 10) & 0xff;
        return result;
      },
      process.browser ? new Uint8Array(4) : new Buffer(4)
    );
  } catch (err) {
    throw new Error(`${INVALID_IPv4}`);
  }
}

function fromBuffer(buff) {
  try {
    return buff.join('.');
  } catch (err) {
    throw new Error(`${INVALID_BUFFER}: ${buff}`);
  }
}

function toDecimal(ip) {
  if (!isIpHost(ip)) throw new Error(`${INVALID_IPv4}: ${ip}`);

  return (
    ip.split('.').reduce((ipInt, octet) => {
      return (ipInt << 8) + parseInt(octet, 10);
    }, 0) >>> 0
  );
}

function fromDecimal(ipInt) {
  if (!Number.isInteger(ipInt)) {
    throw new TypeError(`${INVALID_IP_DECIMAL}: ${ipInt}`);
  }
  if (ipInt < 0 || ipInt > 4294967295) {
    throw new Error(`${IP_DECIMAL_OVERFLOW}`);
  }

  return `${ipInt >>> 24}.${(ipInt >> 16) & 255}.${(ipInt >> 8) & 255}.${ipInt & 255}`;
}

function fromBitmask(bitmask) {
  bitmask = parseInt(bitmask);
  if (!Number.isInteger(bitmask) || bitmask <= 0 || bitmask > 32) {
    throw new Error(`${INVALID_BITMASK}`);
  }
  try {
    const mask = [];
    for (let i = 0; i < 4; i++) {
      var n = Math.min(bitmask, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      bitmask -= n;
    }
    return mask.join('.');
  } catch (err) {
    throw new Error(`${INVALID_BITMASK}`);
  }
}

function toBitmask(netmask) {
  if (!NETMASK_REGEX.test(netmask)) throw new Error(`${INVALID_NETMASK}`);

  try {
    const maskNodes = netmask.match(/(\d+)/g);
    const bitmask = maskNodes.reduce((result, node) => result + ((node >>> 0).toString(2).match(/1/g) || []).length, 0);
    return bitmask;
  } catch (err) {
    throw new Error(`${INVALID_NETMASK}`);
  }
}

function subnet(value) {
  if (!isSubnet(value)) throw new TypeError(`${INVALID_SUBNET}: ${value}`);

  const mask = value.split('/')[1];
  const netmask = NETMASK_REGEX.test(mask) ? mask : fromBitmask(mask);

  const _addrBuffer = toBuffer(value.split('/')[0]);
  const _maskBuffer = toBuffer(netmask);
  const _network = _addrBuffer.reduce((result, _, i) => {
    result[i] = _addrBuffer[i] & _maskBuffer[i];
    return result;
  }, []);
  const networkDecimal = toDecimal(_network.join('.'));

  // const wildcardMask = null;
  const bitmask = NETMASK_REGEX.test(mask) ? toBitmask(mask) : parseInt(mask);
  const numberOfHosts = Math.pow(2, 32 - bitmask);
  const hostCount = numberOfHosts <= 2 ? numberOfHosts : numberOfHosts - 2;
  const firstHost = numberOfHosts <= 2 ? fromDecimal(networkDecimal) : fromDecimal(networkDecimal + 1);
  const lastHost =
    numberOfHosts <= 2
      ? fromDecimal(networkDecimal + numberOfHosts - 1)
      : fromDecimal(networkDecimal + numberOfHosts - 2);
  const networkAddress = _network.join('.');
  const broadcastAddress = fromDecimal(networkDecimal + numberOfHosts - 1);

  return {
    netmask,
    // wildcardMask,
    bitmask,
    hostCount,
    firstHost,
    lastHost,
    networkAddress,
    broadcastAddress
  };
}

const ipv4 = {
  isValid,
  isSubnet,
  isIpHost,
  isValidIpRange,
  validateIpRange,
  toBuffer,
  fromBuffer,
  toBitmask,
  fromBitmask,
  toDecimal,
  fromDecimal,
  subnet
};

const ipAddressUtils = {
  ipv4
};

exports.default = ipAddressUtils;
exports.ipv4 = ipv4;
