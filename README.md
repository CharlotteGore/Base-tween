base.tween({
start : 0,
end : 100,
fps : 100,
duration: 1000,
easing : 'accelerate',
onComplete : function(){ console.log('done');},
onTick : function(val){ console.log(val)}
}).play();
base
110
41
32
23
24
25
6
27
9
210
12
13
14
16
17
19
20
22
24
25
27
29
31
34
36
39
41
44
47
49
53
55
59
64
66
70
73
78
83
86
91
94
100
done