
Leader-Follower Strategy - query writes to leader, leader replicates to followers 
- can be done synchronous (requires followers to have up to date data before ack)
- can be done async (sends followers - without waiting for ack - but introduces inconsistencies between leader and follower)
When leader fails (failover) - replica promoted to be leader 
without a leader can't handle writes

Leader-Leader

Multi-Leader

electing new leader (paxos)


Leaderless replication (e.g. dynamodb)
