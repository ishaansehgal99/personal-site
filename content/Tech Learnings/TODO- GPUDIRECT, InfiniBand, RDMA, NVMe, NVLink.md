
Ethernet
![[Pasted image 20250222143637.png]]

I think the best way to understand Infiniband is like comparing it to ethernet. Ethernet both has cabling, switches, NICs, as well as a networking protocol. 

Similiarly so does Infiniband. While InfiniBand is an open standard, NVIDIA does develop most of the InfiniBand network adapters and switches used today. 

### **InfiniBand vs. Ethernet – What It Includes**

| Feature      | InfiniBand (IB)                         | Ethernet                          |
| ------------ | --------------------------------------- | --------------------------------- |
| **Protocol** | InfiniBand Architecture (IBA)           | Ethernet, TCP/IP                  |
| **Cabling**  | Copper or fiber (QSFP connectors)       | Copper (RJ45) or fiber (SFP)      |
| **Switches** | InfiniBand switches (Mellanox, NVIDIA)  | Ethernet switches (Cisco, Arista) |
| **NICs**     | InfiniBand Host Channel Adapters (HCAs) | Ethernet NICs                     |

While both InfiniBand and Ethernet support data center and HPC networking, InfiniBand is
- **Faster** (up to 1.2 Tbps vs. 400 Gbps for Ethernet).
- InfiniBand scales efficiently for thousands of nodes in supercomputing clusters
- Ethernet mainly uses **TCP/IP**, while InfiniBand uses a **specialized high-speed interconnect protocol**
- Lossless, ethernet is packet-based and may drop packets which means it requires retransmission, but Inifiniband is lossless

InfiniBand also has better throughput, and offers RDMA. RDMA bypasses the CPU and transfers data directly from one machine's memory to another, it bypasses OS kernel allowing direct memory transfers.

## NVLink

NVLink is an ultra-fast GPU-to-GPU communication, whereas InfiniBand is server-to-server. Together Infiniband and NVLink run complementary.

## NVMe SSDs

NVMe is for storage (connects SSDs to CPU/memory). It is a storage protocol and SSDs must be designed to use the NVMe protocol over PCIe. 

If you want to run it over network it is NVMe-oF - NVMe over Fabric. 

NVMe still use the PCIe (Peripherical Componenet Interconnect Express bus) to communicate with the CPU (as opposed to say older SATA or SAS). PCIe is the physical connection/bus where is NVMe is the storage protocol used by SSDs over PCIe. 


## Conclusion

Across Node Level:
InfiniBand = Networking Technology (Cables, switches, NIC, Protocol) for faster node-to-node communication

RDMA = Utilized by Infiniband (and other protocols) for fast RAM-to-RAM data transfer across nodes over a network, bypasses the OS Kernel and CPU


Within Node Level:
NVLink = GPU Interconnect (Fast GPU-to-GPU Communication within node - does not work across nodes) improvement/faster than PCIe

NVMe  = Storage Protocol + SSD Type (For fast CPU/RAM <-> SSD communication) utilizes PCIe for communication



