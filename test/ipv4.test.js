import { ipv4 } from '..';
import { IP_RANGE_OVERFLOW } from '../src/shared/messages';

describe('IP Address Utils', () => {
  it('should validate IPv4 address', () => {
    expect(ipv4.isValid('192.168.1.0/24')).toBe(true);
    expect(ipv4.isValid('192.168.1.0/255.255.255.0')).toBe(true);
    expect(ipv4.isValid('192.168.1.0')).toBe(true);
    expect(ipv4.isValid('192.168.1.0 255.255.255.0')).toBe(true);
  });

  it('should validate IPv4 subnet', () => {
    expect(ipv4.isSubnet('192.168.1.0/24')).toBe(true);
    expect(ipv4.isSubnet('192.168.1.0/255.255.255.0')).toBe(true);
    expect(ipv4.isSubnet('192.168.1.0')).toBe(false);
    expect(ipv4.isSubnet('192.168.1.0 255.255.255.0')).toBe(false);
  });

  it('should validate IPv4 host', () => {
    expect(ipv4.isIpHost('192.168.1.0/24')).toBe(false);
    expect(ipv4.isIpHost('192.168.1.0/255.255.255.0')).toBe(false);
    expect(ipv4.isIpHost('192.168.1.0')).toBe(true);
    expect(ipv4.isIpHost('192.168.1.0 255.255.255.0')).toBe(false);
  });

  it('should validate IPv4 range', () => {
    expect(ipv4.isValidIpRange('0.0.0.0-0.0.0.1')).toBe(true);
    expect(ipv4.isValidIpRange('0.0.0.0 - 0.0.0.1')).toBe(true);

    expect(ipv4.isValidIpRange('0.0.0.1-0.0.0.1')).toBe(true);
    expect(ipv4.isValidIpRange('0.0.0.1-0.0.0.0')).toBe(false);

    expect(
      ipv4.isValidIpRange('192.168.1.1-192.168.1.98', {
        subnet: '192.168.1.99/24'
      })
    ).toBe(true);

    expect(
      ipv4.isValidIpRange('192.168.1.128-192.168.1.133', {
        subnet: '192.168.0.1/26'
      })
    ).toBe(false);

    expect(
      ipv4.isValidIpRange('0.0.0.1-192.168.1.191', {
        subnet: '192.168.0.1/26'
      })
    ).toBe(false);

    expect(ipv4.isValidIpRange('0.0.0.0-0.0.0.1', { withSpace: true })).toBe(false);
    expect(ipv4.isValidIpRange('0.0.0.0 - 0.0.0.1', { withSpace: true })).toBe(true);
    expect(ipv4.isValidIpRange('0.0.0.0-0.0.0.1', { withSpace: false })).toBe(true);

    expect(
      ipv4.isValidIpRange('0.0.0.0 - 0.0.0.1', {
        withSpace: false
      })
    ).toBe(false);

    expect(function() {
      ipv4.validateIpRange('0.0.0.1-192.168.1.191', {
        subnet: '192.168.0.1/26'
      });
    }).toThrow(IP_RANGE_OVERFLOW);
  });

  it('should convert IPv4 to buffer', () => {
    expect(ipv4.toBuffer('192.168.0.1')).toEqual(new Buffer([192, 168, 0, 1]));
  });

  it('should convert buffer to IPv4', () => {
    expect(ipv4.fromBuffer(new Buffer([192, 168, 0, 1]))).toBe('192.168.0.1');
  });

  it('should convert IPv4 to decimal', () => {
    expect(ipv4.toDecimal('192.168.0.1')).toBe(3232235521);
  });

  it('should convert decimal to IPv4', () => {
    expect(ipv4.fromDecimal(3232235521)).toBe('192.168.0.1');
    expect(function() {
      ipv4.fromDecimal('abc');
    }).toThrow();
    expect(function() {
      ipv4.fromDecimal(4294967296);
    }).toThrow();
  });

  it('should convert subnet mask to bitmask', () => {
    expect(ipv4.toBitmask('255.255.0.0')).toBe(16);
  });

  it('should convert subnet mask from bitmask', () => {
    expect(ipv4.fromBitmask(16)).toBe('255.255.0.0');
  });

  it('should calculate subnet', () => {
    expect(ipv4.subnet('192.168.0.1/26').bitmask).toBe(26);
    expect(ipv4.subnet('192.168.0.1/26').netmask).toBe('255.255.255.192');
    expect(ipv4.subnet('192.168.0.1/255.255.255.192').bitmask).toBe(26);
    expect(ipv4.subnet('192.168.0.1/255.255.255.192').netmask).toBe('255.255.255.192');
    expect(ipv4.subnet('192.168.0.1/255.255.255.192').hostCount).toBe(62);
    expect(ipv4.subnet('192.168.0.1/26').networkAddress).toBe('192.168.0.0');
    expect(ipv4.subnet('192.168.0.1/26').firstHost).toBe('192.168.0.1');
    expect(ipv4.subnet('192.168.0.1/26').lastHost).toBe('192.168.0.62');
    expect(ipv4.subnet('192.168.0.1/26').broadcastAddress).toBe('192.168.0.63');
  });
});
