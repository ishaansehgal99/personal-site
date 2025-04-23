---
publish: true
---

Bellman-Ford Algorithm requires iterating through every single edge in the graph V times to relax all edges. 

It can handle negative edges and cycles unlike djikstra.


```python
def bellmanFord(V, edges, src):
	dist = [float("inf") for n in V]
	dist[src] = 0
	for i in range(V):
		for edge in edges:
			u, v, wt = edge
			if dist[u] != float("inf") and dist[u] + wt < dist[v]:
				# If this is the Vth relaxation, then there
				# is a negative cycle
				if i == V - 1: 
					return [-1]
				dist[v] = dist[u] + wt
	return dist


if __name__ == '__main__':
    V = 5
    edges = [[1, 3, 2], [4, 3, -1], [2, 4, 1], [1, 2, 1], [0, 1, 5]]

    src = 0
    ans = bellmanFord(V, edges, src)
    print(' '.join(map(str, ans)))
```



[[Algorithms]] [[Graphs]]