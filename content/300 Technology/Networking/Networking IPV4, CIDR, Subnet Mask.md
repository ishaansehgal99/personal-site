---
publish: true
---

### IPV4
IPV4 is a protocol for assigning unique addresses to devices on a network. An IPV4 address is a 32-bit number, typically written in dotted decimal format like 192.168.0.0.1.

Note: each dot divides $2^{8}$ (0-255) segments.


### CIDR
CIDR is a method for specifying IP address ranges and subnetting. It uses slash notation (e.g. /24 to indicate how many bits are used for the network part of the address)

For example in the IP address 192.168.1.0/24. 
The /24 means first 24 buts are for the network, and 8 bits are for host addresses. 
This covers **192.168.1.0 to 192.168.1.255** (256 addresses).

### Subnet Mask
Subnet mask is another way of expressing the same thing: how the IP space is split between network and host. 


| CIDR | Subnet Mask     | # of IPs      |
| ---- | --------------- | ------------- |
| /8   | 255.0.0.0       | 16.7M         |
| /16  | 255.255.0.0     | 65,536        |
| /24  | 255.255.255.0   | 256           |
| /32  | 255.255.255.255 | 1 (single IP) |


[[Networking]]