## DFS Approach 

In this approach for topological sorting we maintain a stack of the nodes and append to the top of the stack while performing DFS on each node. 

So it would look like this

```python
def topSortUtil(v, adj, visited, stack):
	if visited[v]:
		return
	
	visited[v] = True
	
	for i in adj[v]:
		topSortUtil(i, adj, visited, stack)

	stack.append(v)

def constructadj(V, edges):
    adj = [[] for _ in range(V)]
    for it in edges:
        adj[it[0]].append(it[1])
    return adj

def topSort(vertices, edges):
	stack = []
	visited = [False for v in range(vertices)]
	adj = constructadj(vertices, edges)
	
	for v in range(vertices):
		if not visited[v]:
			topSortUtil(v, adj, visited, stack)

	return stack[::-1]

if __name__ == '__main__':
    # Graph represented as an adjacency list
    v = 6
    edges = [[2, 3], [3, 1], [4, 0], [4, 1], [5, 0], [5, 2]]
    ans = topSort(v, edges)
    print(" ".join(map(str, ans)))
```


Time Complexity: O(V + E) - We visit each edge and node at most once.
Space Complexity: O(V) - We maintain an ordering list of size V.
## BFS Approach (Kahn's Algorithm)

```python
from collections import deque
def topologicalSort(v, edges):
	adj = constructadj(v, edges)

	# Construct indegree map
	indegree = {i: 0 for i in range(v)}
	for edge in edges:
		indegree[edge[1]] += 1

	
	queue = deque([i for i in range(v) if indegree[i] == 0])
	stack = []
	
	while queue:
		curr_node = queue.popleft()
		for neighbor in adj[curr_node]:
			indegree[neighbor] -= 1
			if indegree[neighbor] == 0:
				queue.append(neighbor)
		stack.append(curr_node)

	# len(stack) will never be greater than V
	# but it could be less than V in the case
	# we have cycles, in these cases 
	# nodes will never reach indegree of 0
	if len(stack) != v:
		return [-1]
	
	return stack
		
def constructadj(V, edges):
    adj = [[] for _ in range(V)]
    for it in edges:
        adj[it[0]].append(it[1])
    return adj


if __name__ == '__main__':
    # Graph represented as an adjacency list
    v = 6
    edges = [[2, 3], [3, 1], [4, 0], [4, 1], [5, 0], [5, 2]]
    ans = topologicalSort(v, edges)
    print(" ".join(map(str, ans)))
```


Time Complexity: O(V + E) - We visit every vertex and its neighbors.
Space Complexity: O(V) - We store all V vertices in a stack.


[[Algorithms]] [[Graphs]]