
### Azure Private Link & Endpoint

Private link is an internal secure link within Azure so it allows you to access Azure services over a private connection from your VNet without exposing traffic to the public internet. 


First you have a private endpoint created in your VNet and maps to the Azure service via Private Link. 

Example would be say we want a frontend VNet to securely connect with a backend VNet (where something like a DB is hosted). 

Then we would do the following: 
1. Private Endpoint Placement - private endpoint is created in the backend VNet. This creates a private IP address within the backend VNet allowing other VNets to securely connect
2. Private Link is made between frontend VNet and backend private endpoint. This enables frontend VNet to access the backend service using the private IP of the private endpoint.
3. Traffic is initiated one way from the frontend vnet sending a request to the private link, which resolves the request to the private IP of the private endpoint in the backend vnet. Private endpoint securely connects to the backend service (e.g. a database or API server)


Source is the Frontend VNet
Destination is Private Endpoint associated with the backend service


Any resource in the frontend VNet can initiate a connection as long as it an resolve the private DNS name of the backend service. 

IP conflicts are prevented because Azure ensures unique private IP assignment within the VNet. 

If you want to restrict the resources in the frontend VNet that can resolve the private link to access the backend resource you have a couple options: 
- Use a dedicated subnet - place only the intended VM in that subnet and deploy the private endpoint into that same subnet 
- NSGs need a subnet to apply to - so if our subnet has multiple VMs we can apply NSG rules to restrict inbound/outbound traffic so only the source IP/NIC of the one VM is allowed to reach the private endpoint

Resolve means translating a domain name into an IP address. Private link modifies DNS resolution so that services use privates IPs instead of public ones. Azure Private Link automatically creates a private DNS zone and links it to your VNet/subnet. This ensures that your services resolve to the correct private IP instead of the public one.


### VNet Peering

VNet Peering allows VNets to communicate with each other, but doesn't work with overlapping IP addresses. To enable peering among both subnets you need to do

```zsh
# Create VNet Peering from Frontend-VNet to Backend-VNet
az network vnet peering create \
  --name FrontendToBackendPeering \
  --resource-group MyResourceGroup \
  --vnet-name Frontend-VNet \
  --remote-vnet Backend-VNet \
  --allow-vnet-access

# Create VNet Peering from Backend-VNet to Frontend-VNet
az network vnet peering create \
  --name BackendToFrontendPeering \
  --resource-group MyResourceGroup \
  --vnet-name Backend-VNet \
  --remote-vnet Frontend-VNet \
  --allow-vnet-access
```

If there are conflicting IPs VNet Peering does not work! Both VNets must have unique non-overlapping CIDR blocks (e.g.`10.0.0.0/16` and `10.1.0.0/16`)


### **VNet Peering vs. Private Link**

|Feature|**VNet Peering**|**Private Link**|
|---|---|---|
|**Purpose**|Connect **entire VNets**|Connect **specific services/resources**|
|**Traffic Flow**|Full VNet-to-VNet|Only to Private Endpoints|
|**Works Across Regions?**|Yes (Global Peering)|Yes|
|**Avoids Public Internet?**|Yes|Yes|
|**Requires Overlapping IPs to be Resolved?**|✅ Yes|❌ No (Private Link allows connections even if VNets overlap)|
Traffic is routed native in VNet there is no need for special prefixes or modifications - resources in one VNet can directly access resources in the other VNet using their private IP addresses.

**If You Need Transitive Peering (Peering Between Multiple VNets)**

By default, if **VNet A ↔ VNet B** and **VNet B ↔ VNet C**, traffic **from VNet A to VNet C does NOT work automatically**.

You must **enable "Allow Forwarded Traffic"** in peering settings to make this work.  This allows A → B → C to work, with B acting as a transit network. A still does NOT "directly" connect to C—it must pass through B.


[[Networking]]