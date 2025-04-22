

Design TicketMaster

Function requirements (features)
Non-functional requirements (qualities)
1. Requirements
2. Core Entities (What is the data persisted)
3. APIs
4. High-Level Design (Satisfies main features)
5. Deep Dives


Functional Requirements
- Book Tickets
- View an event
- Search for events


Non-functional requirements
CAP Theorem (Availability or Consistency)
- Consistency >> Availability (no double booking)
- Strong consistency for booking tickets & high availability for search and viewing events
- read >> write (more people looking for events than writing)
