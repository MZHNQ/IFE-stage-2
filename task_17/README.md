任务链接：[零基础JavaScript编码（五）](http://ife.baidu.com/task/detail?taskId=17)
DEMO：[http://yanisj.github.io/ife-missions/task-1-17/task.html](http://yanisj.github.io/ife-missions/task-1-17/task.html)

##版本调整记录
### v0.2.0

- process

#### process
在 setAqiChartData -> _formatByTime 中，添加函数 process，用于生成符合要求的数据格式。该函数同时服务于 week & month。在 week 和 month 中，只需要提前整理出一个包含单位天数的数组，调用 process 即可完成数据整理。

### v0.2.1

- 调整代码格式
- 修改 process 实现，去掉多余变量
- 在能使用 map 代替 forEach 的地方，尽量使用 map