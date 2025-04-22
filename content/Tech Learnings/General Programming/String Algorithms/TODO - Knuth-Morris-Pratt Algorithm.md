The KMP algorithm involves some preprocessing of our string making a prefix map. 

The prefix map stores any repeated prefixes. And the idea is that we don't need to naively iterate through our string one character at a time. 

When we have a mismatch between our main string and our pattern. We resume searching from the last occurrence of the same pattern in our pattern string to see if maybe it would work from there.  

This allows us to skip intermediary steps that don't have matching substrings. 

We can restart the search from the closest prefix we would know that would work otherwise completely restart.

Something to note here is that we must shift our search to the closest possible new match and the only place that happens with a full shift of (j-l) any smaller shift is going to have a mismatch because we need the first match where there is alignment between the first mismatched occurrence could potentially be aligned.

I think the main intuition I am realizing is that once we have a mismatch in our pattern and text. We need to find the next possible place where our pattern and our text match so we can resume search and the only place where the mismatch happened and the next possible match is is where the two last aligned at.

*Jump to the next position indicated by the prefix function (i.e., `lps`), because shorter jumps have already been invalidated by what we know from the previous match and mismatch.*


```python


```


https://chatgpt.com/c/67fc9ded-f73c-8009-93a9-51db45626971?model=o1



