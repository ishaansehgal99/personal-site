Sharding strategies
Geo-Based Sharding

Range-Based Sharding - divides based on ranges of the letter - sharding first letter of the users first name - divides 26 buckets

Hash-Based Sharding

Manual or Automatic Sharding

Advantages
- Shards allows scaling
- Smaller data in each shard is faster performance
- Reliability and accessibility 
- nodes can run on commodity hardware 

Disadvantages
- Not all data can be sharded - for example foreign keys are typically only amenable to a single shard - meaning if you try to lookup a foreign key you would have to search across all shards to find it
- Not easy to undo sharding once its been done


Partioning is splitting data within a database 
Sharding is splitting data across multiple dbs/servers

Example of Partitioning
Parent Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    registration_year INT NOT NULL
) PARTITION BY RANGE (registration_year);
```
Partitions
```sql
CREATE TABLE users_2022 PARTITION OF users FOR VALUES FROM (2022) TO (2023);
CREATE TABLE users_2023 PARTITION OF users FOR VALUES FROM (2023) TO (2024);
```

✅ Faster queries (PostgreSQL only scans relevant partitions).

Example of sharding
Create shard1
```sql
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
```

Create shard2 
```sql
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
```
Pick the right DB
```python
def get_customer_db(customer_id):
    if customer_id % 2 == 0:
        return "customers_db1"
    else:
        return "customers_db2"
```

✅ Enables horizontal scaling (each database handles only part of the load).


Sharding within a single db defeats the purpose - which is to distribute load across multiple databases or servers for scalability.

If your goal is to maximize query performance within a single database, partioning is a better choice than sharding.


SQL doesn't offer sharding by default but NoSQL does
- Replication ensures high availability and scales read capacity
- Sharding enables horizontal scaling by distributing data across multiple servers


[[Databases]]