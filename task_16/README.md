#任务十四：零基础JavaScript编码（四）
任务链接：[零基础JavaScript编码（四）](http://ife.baidu.com/task/detail?taskId=16)
DEMO：[http://yanisj.github.io/ife-missions/task-1-16/index.html](http://yanisj.github.io/ife-missions/task-1-16/index.html)

##版本调整记录
### v0.1.1
#### 修改验证城市名的正则
本来用 `\w` 来匹配英文输入，这是不对的，`\w` 等价于 `[A-Za-z0-9_]`。更正为 `A-Za-z`。

#### 删除自己的 trim 方法，改用 String 自代的 trim

#### 当表格中所有行被删除，不再渲染表格
添加 isEmptyObj 方法来判断数据是否为空。

#### 改变 delBtnHandle 获取城市名称的方式
原来的写法与 HTML 结构绑的太死，还是采取 data-set 来传递数据