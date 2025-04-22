A compact hash string representation of a geographic coordinate (lattitude, longitude)

The longer the string, the smaller (more precise) the box it represents. Two nearby points will share a common prefix in their geohashes.


![[Pasted image 20250416211304.png]]

You can see here that layer one has a prefix string of `2` and then all the subfields build on this hash with an extra digit, providing a more precise location.


TODO - could go into more detail on how they work


[[Data Structures]]