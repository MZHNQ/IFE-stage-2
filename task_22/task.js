// Node
function Node (data) {
  this.data     = data;
  this.parent   = null;
  this.left     = null;
  this.right    = null;
  this.side     = null;
}

/*===========
 *
 *  Tree
 *
 *===========
 *
 * Methods:
 *
 *  深度优先遍历 traverseDF( callback ) 
 *  广度优先遍历 traverseBF( callback )
 *  前序遍历     traverseDLR( callback )
 *  中序遍历     traverseLDR( callback )
 *  后序遍历     traverseLRD( callback )
 *  contains( data, traversal )
 *  add ( child, parent )
 *  remove ( node, parent )
 *
 */

function Tree (data) {
  var node = new Node(data);
  this._root = node;
}

Tree.prototype.traverseDF = function (callback) {
  (function recurse (currentNode) {
    if (currentNode.left) recurse(currentNode.left);
    if (currentNode.right) recurse(currentNode.right);
    callback(currentNode);
  })(this._root);
};

Tree.prototype.traverseBF = function (callback) {
  var queue = [];
  queue.push(this._root);
  currentTree = queue.shift();

  while (currentTree) {
    if (currentTree.left) queue.push(currentTree.left);
    if (currentTree.right) queue.push(currentTree.right);
    callback(currentTree);
    currentTree = queue.shift();
  }
};

// 前序遍历
Tree.prototype.traverseDLR = function (callback) {
  (function recurse (currentNode) {
    if (!currentNode) return;
    callback(currentNode);
    recurse(currentNode.left);
    recurse(currentNode.right);
  })(this._root);
}

// 中序遍历
Tree.prototype.traverseLDR = function (callback) {
  (function recurse (currentNode) {
    if (!currentNode) return;
    recurse(currentNode.left);
    callback(currentNode);
    recurse(currentNode.right);
  })(this._root);
}

// 后续遍历
Tree.prototype.traverseLRD = function (callback) {
  (function recurse (currentNode) {
    if (!currentNode) return;
    recurse(currentNode.left);
    recurse(currentNode.right);
    callback(currentNode);
  })(this._root);
}

Tree.prototype.contains = function (callback, traversal) {
  traversal.call(this, callback);
};

Tree.prototype.add =function (data, toData, side, traversal) {
  var child    = new Node(data),
      parent   = null,
      callback = function (node) {
        if (node.data === toData) {
          parent = node;
        }
      };
      this.contains(callback, traversal);
      if (parent && !parent[side]) {
        parent[side] = child;
        child.parent = parent;
        child.side   = side;
      } else if (!parent){
        throw new Error('Cannot add node to a non-existent parent.');
      } else {
        throw new Error('The ' + side + ' element is exist.');
      }
};

Tree.prototype.remove = function (data, fromData, traversal) {
  var tree          = this,
      parent        = null,
      target        = null,
      childToRemove = null,
      index;

  var getParent = function (node) {
    if (node.data === fromData) {
      parent = node;
    }
  }

  var getTarget = function (node) {
    if (node.data === data) {
      target = node;
    }
  }

  this.contains(getParent, traversal);

  if (parent) {
    this.contains(getTarget, traversal);
    if (!target) {
      throw new Error('Node to remove does not exist.');
    } else {
      childToRemove = target;
      parent[target.side] = null;
    }
  } else {
    throw new Error('Parent does not exist.');
  }

  return childToRemove;
}



// 实例化一棵树并添加数据
var tree = new Tree('one');
tree.add('two', 'one', 'left', tree.traverseBF);
tree.add('three', 'one', 'right', tree.traverseBF);
 
tree.add('four', 'two', 'left', tree.traverseBF);
tree.add('five', 'two', 'right', tree.traverseBF);

tree.add('six', 'three', 'left', tree.traverseBF);
tree.add('seven', 'three', 'right', tree.traverseBF);

tree.add('eight', 'four', 'left', tree.traverseBF);
tree.add('nine', 'four', 'right', tree.traverseBF);

tree.add('ten', 'five', 'left', tree.traverseBF);
tree.add('eleven', 'five', 'right', tree.traverseBF);

tree.add('twelve', 'six', 'left', tree.traverseBF);
tree.add('thirteen', 'six', 'right', tree.traverseBF);

tree.add('fourteen', 'seven', 'left', tree.traverseBF);
tree.add('fifteen', 'seven', 'right', tree.traverseBF);



/*===========
 *
 *  Task
 *
 *===========
 */
// 管理动画序列
var states = [];
// 定时器
var timer;
// 渲染树
function render () {
  var container = document.querySelector('.container');

  tree.traverseBF(function (node) {
    node.html = document.createElement('div');
    if (node.parent) {
      node.parent.html.appendChild(node.html);
    } else {
      node.html.classList.add('root');
    }
  });

  container.appendChild(tree._root.html);
}

function draw () {
  var pre;
  function stop () {
    pre.html.classList.remove('highlight');
    pre = undefined;
    clearInterval(timer);
    timer = null;
  }
  timer = setInterval( function () {
    if (!states.length) {
      stop();
    } else {
      if (pre) {
        pre.html.classList.remove('highlight');
      }
      pre = states.shift();
      pre.html.classList.add('highlight');
    }
  }, 500);
}
// 生成按钮点击事件处理函数
function deal (traversal) {
  return function () {
    if (timer) return alert('动画正在进行中');
    traversal.call(tree, function (node) {
      states.push(node);
      console.log(node.data);
    });
    draw();
  }
}

function initEvent () {
  var dfsBtn = document.querySelector('#dfs'),
      bfsBtn = document.querySelector('#bfs'),
      dlrBtn = document.querySelector('#dlr'),
      ldrBtn = document.querySelector('#ldr'),
      lrdBtn = document.querySelector('#lrd');
  dfsBtn.addEventListener('click', deal(tree.traverseDF));
  bfsBtn.addEventListener('click', deal(tree.traverseBF));
  dlrBtn.addEventListener('click', deal(tree.traverseDLR));
  ldrBtn.addEventListener('click', deal(tree.traverseLDR));
  lrdBtn.addEventListener('click', deal(tree.traverseLRD));
}

function init () {
  render();
  initEvent();
}

window.onload = init;


