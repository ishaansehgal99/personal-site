---
publish: true
---


```python
"""  
The idea here is that we have a graph and a starting  
point, and we have to find the shortest distance from the  
start to all other vertices in the graph.  
  
We can do this by initializing all distances to infinity at  
first, and then we append to our heap all outgoing edges and their  
weights at first. As we pop off the heap each element we pop off  
we update shortest distance to that node if it could be shorter  
if not we skip it as we already have a shorter path. We can also  
store a previous map to keep track of the source node for each node.  
  
In terms of complexity,  
  
Time Complexity -  
Now in this graph we end up with a heap of at size at most size E  
we perform at most one insertion and one delection for each edge.  
  
Which means we do at most E operations on a priority queue of size E.  
  
So we have O(ElogE) plus we have to do an initialization in the beginning of our  
dist array which is of size O(V) so our resulting time complexity is  
O(V + ElogE) 
  
  
Space Complexity - worst case we store all the vertices  
multiple times, we store it for every edge relaxation we do.  
So that means we use O(E) space for our heap.  
  
Now we also store the dist and prev maps which are of size O(V).  
And V could be >> E say for an edgeless graph.  
  
So for completeness we say: O (V + E)  
  
"""  
import heapq  
def dijkstra(graph, start):  
    dist = {n: float("inf") for n in graph}  
    dist[start] = 0  
    prev = {n: None for n in graph}  
    heap = [(0, start)]  
  
    while heap:  
        curr_dist, source_node = heapq.heappop(heap)  
        if curr_dist > dist[source_node]:  
            continue  
  
        for neighbor in graph[source_node]:  
            neigh_node, neigh_dist = neighbor  
            if dist[neigh_node] < curr_dist + neigh_dist:  
                continue  
  
            dist[neigh_node] = curr_dist + neigh_dist  
            prev[neigh_node] = source_node  
            heapq.heappush(heap, (curr_dist + neigh_dist, neigh_node))  
  
    return dist, prev  
  
  
if __name__ == "__main__":  
    # Sample graph represented as an adjacency list  
    graph = {  
        'A': [('B', 1), ('C', 4)],  
        'B': [('A', 1), ('C', 2), ('D', 5)],  
        'C': [('A', 4), ('B', 2), ('D', 1)],  
        'D': [('B', 5), ('C', 1)]  
    }  
    distances, previous = dijkstra(graph, 'A')  
  
    print("Shortest distances from A:")  
    for node, d in distances.items():  
        print(f"  A -> {node}: {d}")  
  
    print("\nPrevious nodes in shortest paths:")  
    for node, p in previous.items():  
        print(f"  {node}: came from {p}")
```


https://www.youtube.com/watch?v=YMyO-yZMQ6g&ab_channel=NiemaMoshiri 


[[Algorithms]] [[Graphs]]