
Normalization
Organizing a DB to reduce redundancy by dividing tables into smaller related tables, establishing relationships using foreign keys. This requires queries with need for joins.

Denormalization 
Denormalization is process of combining related tames to reduce number of joins needed. This improves read performance by introducing some redundancy, but can lead to increased storage usage, and potential inconsistencies when updating data. 

#### **Normalized Schema**
Customers Table

| customer_id | name  | email           |
| ----------- | ----- | --------------- |
| 1           | Alice | alice@email.com |
| 2           | Bob   | bob@email.com   |
Orders Table

| order_id | customer_id | order_date | total_amount |
| -------- | ----------- | ---------- | ------------ |
| 101      | 1           | 2024-02-20 | $50          |
| 102      | 2           | 2024-02-21 | $30          |

- Data is stored efficiently
- Joins slow down read performance, especially with large tables


#### **New Orders Table (Denormalized)**

|order_id|name|email|order_date|total_amount|
|---|---|---|---|---|
|101|Alice|alice@email.com|2024-02-20|$50|
|102|Bob|bob@email.com|2024-02-21|$30|
- Faster reads (no join needed, direct query to one table)
- Redundancy (Customer details are duplicated in every order)
- Slower writes (if Alice changes her email, all rows need updating)
### **Impact Analysis**

|**Operation**|**Before (Normalized)**|**After (Denormalized)**|
|---|---|---|
|**Read Performance**|❌ Slower (requires JOINs)|✅ Faster (no JOINs)|
|**Write Performance**|✅ Faster (update in one table)|❌ Slower (update multiple rows)|
|**Storage Efficiency**|✅ Less redundancy|❌ More redundancy|


[[Databases]]
