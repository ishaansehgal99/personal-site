
The OSI model breaks networking into **seven distinct layers**, each responsible for a specific function.

| Layer | Name         | Purpose                                                  | Example Technologies         |
| ----- | ------------ | -------------------------------------------------------- | ---------------------------- |
| **7** | Application  | Interfaces with end-user applications (HTTP, FTP, email) | HTTP, HTTPS, FTP, SMTP       |
| **6** | Presentation | Converts data formats, encryption/decryption             | SSL/TLS, ASCII, JPEG         |
| **5** | Session      | Manages connections between applications                 | NetBIOS, RPC, SIP            |
| **4** | Transport    | Handles end-to-end communication and reliability         | TCP, UDP                     |
| **3** | Network      | Routes packets between different networks                | IP, ICMP, BGP, OSPF          |
| **2** | Data Link    | Transfers frames within the same physical network        | Ethernet, Wi-Fi, ARP         |
| **1** | Physical     | Deals with hardware, cables, and signals                 | Fiber optics, coaxial cables |
Session (L5) is layer responsible for starting, maintaining and ending communication between devices. Like when you login to a remote server via SSH. 
Examples include RDP, SSH, Websockets, streaming services, VoIP. 


[[Networking]]